"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { createBrowserClient } from '@supabase/ssr';
import Image from "next/image";

const categories = [
  { value: "digital-online", label: "Digital & Online Hustles" },
  { value: "creative-artistic", label: "Creative & Artistic Hustles" },
  { value: "business-entrepreneurship", label: "Business & Entrepreneurship" },
  { value: "tech-skills", label: "Tech & Skills-based Hustles" },
  { value: "gig-economy", label: "Gig Economy Hustles" },
  { value: "passive-income", label: "Passive Income Hustles" },
  { value: "lifestyle-service", label: "Lifestyle & Service Hustles" },
  { value: "student-parttime", label: "Student & Part-time Friendly Hustles" },
];

export interface StoryData {
  id?: string; // Optional, assuming it might be added by the API
  title: string;
  name: string;
  hustle: string;
  rating: number;
  image: string;
  story: string;
  category: string;
}

interface SubmitStoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitted: (newStory: StoryData) => void;
}

export default function SubmitStoryModal({ isOpen, onClose, onSubmitted }: SubmitStoryModalProps) {
  const [formData, setFormData] = useState<StoryData>({
    title: "",
    name: "",
    hustle: "",
    rating: 5,
    image: "",
    story: "",
    category: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    if (imageFile) {
      const objectUrl = URL.createObjectURL(imageFile);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else {
      setPreviewUrl(null);
    }
  }, [imageFile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof StoryData) => (value: string) => {
    setFormData(prev => ({ ...prev, [name]: name === 'rating' ? Number(value) : value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image file too large (max 5MB)');
        return;
      }
      setImageFile(file);
    }
  };

  const validateForm = () => {
    if (!formData.title || !formData.name || !formData.hustle || !formData.category || !formData.story) {
      return 'All fields except image are required.';
    }
    if (!imageFile && !formData.image) {
      return 'Please provide an image file or URL.';
    }
    if (formData.rating < 1 || formData.rating > 5) {
      return 'Rating must be between 1 and 5.';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      let imageUrl = formData.image;

      if (!imageUrl && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${fileExt}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('story-images')
          .upload(`public/${fileName}`, imageFile, {
            cacheControl: '3600',
            upsert: false,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from('story-images')
          .getPublicUrl(`public/${fileName}`);

        imageUrl = publicUrlData.publicUrl;
      }

      const storyData = {
        ...formData,
        image: imageUrl,
      };

      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(storyData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to submit story');
      }

      const newStory: StoryData = await response.json();
      onSubmitted(newStory);
      onClose();
    } catch (err) {
      setError((err as Error).message || 'Failed to submit story');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[425px] sm:max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-center">Submit Your Side Hustle Story</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Enter story title" required />
          </div>
          <div>
            <Label htmlFor="name">Your Name *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your name" required />
          </div>
          <div>
            <Label htmlFor="hustle">Side Hustle Name *</Label>
            <Input id="hustle" name="hustle" value={formData.hustle} onChange={handleChange} placeholder="Enter hustle name" required />
          </div>
          <div>
            <Label htmlFor="category">Category *</Label>
            <Select onValueChange={handleSelectChange('category')} value={formData.category}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => (
                  <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="rating">Rating (1-5) *</Label>
            <Select onValueChange={handleSelectChange('rating')} value={formData.rating.toString()}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map(num => (
                  <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Image *</Label>
            <div className="space-y-2">
              <Input id="imageFile" type="file" accept="image/*" onChange={handleFileChange} />
              {previewUrl && (
                <div className="relative h-24 w-24 mx-auto">
                  <Image src={previewUrl} alt="Preview" fill className="object-cover rounded-md" />
                </div>
              )}
              <p className="text-xs text-muted-foreground">Or provide URL (overrides file if both provided)</p>
              <Input id="image" name="image" value={formData.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
            </div>
          </div>
          <div>
            <Label htmlFor="story">Your Story *</Label>
            <Textarea id="story" name="story" value={formData.story} onChange={handleChange} placeholder="Share your journey..." required rows={4} />
          </div>
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? 'Submitting...' : 'Submit Story'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
} 