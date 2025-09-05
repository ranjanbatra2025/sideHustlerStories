'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Eye, Target, Flame, Bookmark, TrendingUp, Clock, ChevronRight, Trophy, Search, PlusCircle, Share2, Heart, Zap, Play, Star, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import SubmitStoryModal from "@/app/stories/SubmitStoryModal";

// Define types
interface StoryData {
  id?: string;
  title: string;
  name: string;
  hustle: string;
  rating?: number;
  image?: string; // Optional if computed
  story: string;
  category: string;
  views?: number;
  updated_at?: string;
}

interface Story {
  id: number;
  title: string;
  name: string;
  hustle: string;
  rating: number;
  image: string;
  story: string;
  category: string;
  views: number;
  updated_at: string;
  readTime: string;
  viewsStr: string;
  trending: boolean;
  snippet: string;
}

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
  color?: string;
}

interface ReadStory {
  story_id: number;
  created_at: string;
}

const SideHustleSnapsDashboard = () => {
  const [userName, setUserName] = useState('User');
  const [categories, setCategories] = useState<Category[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [savedStories, setSavedStories] = useState<Set<number>>(new Set());
  const [readStories, setReadStories] = useState<ReadStory[]>([]); // Changed to array for created_at
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Popular');
  const [showComingSoon, setShowComingSoon] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const [appStats, setAppStats] = useState({
    activeReaders: 0,
    totalEarnings: '$0',
    successRate: '0%'
  });
  const router = useRouter();

  const supabase = useMemo(() => createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  ), []);

  const motivationalQuotes = [
    "Every expert was once a beginner. Every pro was once an amateur.",
    "Your side hustle is your ticket to financial freedom.",
    "Dreams don't work unless you take action.",
    "The best time to start was yesterday. The second best time is now.",
    "Success is not final, failure is not fatal: it is the courage to continue that counts."
  ];

  const hustleFacts = [
    "Airbnb was started as a way to pay rent by renting air mattresses!",
    "Uber began when the founders couldn't get a taxi in Paris.",
    "Sara Blakely started Spanx with just $5,000 and became a billionaire.",
    "Jan Koum was rejected by Facebook before selling WhatsApp to them for $19B.",
    "The average millionaire has 7 different income streams."
  ];

  const categoryEmojis = useMemo(() => ({
    'e-commerce': '🛒',
    'digital-products': '📱',
    'freelancing': '💼',
    'creative-services': '🎨',
    'tech-hustles': '💻',
    'lifestyle-service': '🏡',
    'content-creation': '📹',
  }), []);

  const badges = [
    { name: "Every 5 Stories", icon: "🌟", earned: false, description: "Read your first 5 stories" },
    { name: "7-Day Streak", icon: "🔥", earned: false, description: "Read stories for 7 days straight" },
    { name: "Category Explorer", icon: "🗺️", earned: false, description: "Explore all categories" },
    { name: "Story Saver", icon: "💾", earned: false, description: "Save 10 stories" },
    { name: "Community Member", icon: "👥", earned: false, description: "Share your first story" }
  ];

  const [weeklyStats, setWeeklyStats] = useState({
    storiesRead: 0,
    categoriesExplored: 0,
    readingStreak: 0,
    totalViews: "2.1K"
  });

  const [communityInsights, setCommunityInsights] = useState({
    mostViewed: '',
    topCategory: '',
    motivationMeter: 0,
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('full_name')
          .eq('id', user.id)
          .single();
        setUserName(profile?.full_name || 'User');
        setIsLoading(false); // Set loading to false if user exists
      } else {
        router.push('/signin'); // Use router.push for redirect
      }
    };
    fetchUserProfile();
  }, [supabase, router]);

  // Fetch categories
  useEffect(() => {
    if (isLoading) return; // Skip if still loading/auth checking
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const data = await response.json();
        const sortedData = data.sort((a: { count: number }, b: { count: number }) => b.count - a.count);
        setCategories(sortedData);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    fetchCategories();
  }, [isLoading]);

  // Fetch stories
  useEffect(() => {
    if (isLoading) return;
    const fetchStories = async () => {
      const { data, error } = await supabase.from('stories').select('*').order('rating', { ascending: false });
      if (data) {
        const processedStories: Story[] = data.map(s => ({
          ...s,
          id: Number(s.id), // Ensure id is number
          category: s.category,
          readTime: `${Math.ceil(s.story.split(' ').length / 200)} min`,
          viewsStr: s.views ? `${(s.views / 1000).toFixed(1)}K` : '1K',
          views: s.views || 1000,
          trending: s.rating > 4.7,
          image: categoryEmojis[s.category as keyof typeof categoryEmojis] || '📖',
          snippet: s.story.slice(0, 100) + '...'
        }));

        setStories(processedStories);

        // Compute community insights
        if (data.length > 0) {
          const sortedByViews = [...processedStories].sort((a, b) => b.views - a.views);
          const categoryViews = processedStories.reduce((acc: Record<string, number>, s) => {
            acc[s.category] = (acc[s.category] || 0) + s.views;
            return acc;
          }, {});
          const topCatEntry = Object.entries(categoryViews).sort((a: [string, number], b: [string, number]) => b[1] - a[1])[0];
          const topCat = topCatEntry[0];
          const totalInspiration = processedStories.reduce((acc, s) => acc + s.views, 0);
          setCommunityInsights({
            mostViewed: sortedByViews[0].title,
            topCategory: `${topCat} (${data.filter(s => s.category === topCat).length} stories)`,
            motivationMeter: totalInspiration,
          });
        }
      }
    };
    fetchStories();
  }, [supabase, categoryEmojis, isLoading]);

  // Fetch saved and read
  useEffect(() => {
    if (isLoading) return;
    const fetchSavedAndRead = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: savedData } = await supabase.from('user_stories_saves').select('story_id').eq('user_id', user.id);
        setSavedStories(new Set(savedData?.map(d => d.story_id) || []));

        const { data: readData } = await supabase.from('user_stories_reads').select('story_id, created_at').eq('user_id', user.id);
        setReadStories(readData || []);
      }
    };
    fetchSavedAndRead();
  }, [supabase, isLoading]);

  useEffect(() => {
    if (stories.length > 0 && readStories.length > 0 && categories.length > 0) {
      const readCategories = new Set(readStories.map(r => stories.find(s => s.id === r.story_id)?.category).filter(Boolean));
      const streak = calculateReadingStreak(readStories);
      setWeeklyStats(prev => ({
        ...prev,
        storiesRead: readStories.length,
        categoriesExplored: readCategories.size,
        readingStreak: streak,
      }));
    }
  }, [stories, readStories, categories]);

  const calculateReadingStreak = (reads: ReadStory[]) => {
    if (reads.length === 0) return 0;
    const uniqueDays = [...new Set(reads.map(r => new Date(r.created_at).toISOString().slice(0,10)))].sort((a,b) => new Date(b).getTime() - new Date(a).getTime());
    let streak = 1;
    let current = new Date(uniqueDays[0]);
    for (let i = 1; i < uniqueDays.length; i++) {
      const prev = new Date(uniqueDays[i]);
      if (current.getTime() - prev.getTime() === 86400000) { // 1 day
        streak++;
        current = prev;
      } else {
        break;
      }
    }
    // Check if streak includes today
    const today = new Date().toISOString().slice(0,10);
    if (uniqueDays[0] !== today) {
      return 0;
    }
    return streak;
  };

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, [motivationalQuotes.length]);

  useEffect(() => {
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % hustleFacts.length);
    }, 15000); // Changed to 15 seconds for slower change
    return () => clearInterval(factInterval);
  }, [hustleFacts.length]);

  const toggleSaveStory = async (storyId: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    if (savedStories.has(storyId)) {
      await supabase.from('user_stories_saves').delete().eq('user_id', user.id).eq('story_id', storyId);
      setSavedStories(prev => {
        const newSet = new Set(prev);
        newSet.delete(storyId);
        return newSet;
      });
    } else {
      await supabase.from('user_stories_saves').insert({ user_id: user.id, story_id: storyId });
      setSavedStories(prev => new Set([...prev, storyId]));
    }
  };

  const filteredAndSortedStories = useMemo(() => {
    const filtered = stories.filter(s => s.title.toLowerCase().includes(searchTerm.toLowerCase()));
    if (activeFilter === 'Trending') {
      filtered.sort((a, b) => b.views - a.views);
    } else if (activeFilter === 'New') {
      filtered.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (activeFilter === 'Popular') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (activeFilter === 'Quick Reads') {
      filtered.sort((a, b) => parseInt(a.readTime) - parseInt(b.readTime));
    }
    return filtered;
  }, [stories, searchTerm, activeFilter]);

  const featuredStories = filteredAndSortedStories.slice(0, 3);
  const moreStories = filteredAndSortedStories.slice(3, 5);
  const savedStoriesList = stories.filter(s => savedStories.has(s.id));

  // Update badges earned
  const updatedBadges = badges.map(b => {
    if (b.name === "Every 5 Stories") return { ...b, earned: weeklyStats.storiesRead >= 5 };
    if (b.name === "7-Day Streak") return { ...b, earned: weeklyStats.readingStreak >= 7 };
    if (b.name === "Category Explorer") return { ...b, earned: weeklyStats.categoriesExplored >= categories.length };
    if (b.name === "Story Saver") return { ...b, earned: savedStories.size >= 10 };
    return b;
  });

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/stories?category=${categoryId}`);
  };

  const handleSubmitStory = () => {
    setShowSubmitModal(true);
  };

  const handleStorySubmitted = (newStory: StoryData) => {
    const id = Number(newStory.id) || (stories.length > 0 ? Math.max(...stories.map(s => s.id)) + 1 : 1);
    const processedStory: Story = {
      ...newStory,
      id,
      image: newStory.image || categoryEmojis[newStory.category as keyof typeof categoryEmojis] || '📖',
      views: newStory.views || 1000,
      updated_at: newStory.updated_at || new Date().toISOString(),
      readTime: `${Math.ceil(newStory.story.split(' ').length / 200)} min`,
      viewsStr: newStory.views ? `${(newStory.views / 1000).toFixed(1)}K` : '1K',
      rating: newStory.rating ?? 0,
      trending: (newStory.rating ?? 0) > 4.7,
      snippet: newStory.story.slice(0, 100) + '...',
    };
    setStories(prev => [...prev, processedStory]);
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Side Hustle Snaps',
          text: 'Check out this amazing app for side hustle inspiration!',
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        setShowComingSoon(true); // Fallback
      }
    } else {
      setShowComingSoon(true); // Fallback if share not supported
    }
  };

  const handleSubscribe = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('subscriptions').upsert({
        user_id: user.id,
        email: user.email,
        subscribed_at: new Date().toISOString()
      });
      alert('Subscribed successfully! You will receive daily motivation in your inbox.');
    } else {
      alert('Please sign in to subscribe.');
    }
  };

  const handlePlayVideo = () => {
    setShowComingSoon(true);
  };

  const handleViewAllSaved = () => {
    // Perhaps navigate to a saved stories page, for now coming soon
    setShowComingSoon(true);
  };

  const handleReadTodaysFeatured = () => {
    if (featuredStories.length > 0) {
      router.push(`/stories/${featuredStories[0].id}`);
    }
  };

  // Fetch and compute app stats
  useEffect(() => {
    if (isLoading || stories.length === 0) return;

    const fetchAndComputeStats = async () => {
      // Active Readers: unique users who have read stories
      const { data: readsData } = await supabase.from('user_stories_reads').select('user_id');
      const uniqueReaders = new Set(readsData?.map((r: { user_id: string }) => r.user_id)).size || 0;

      // Success Rate: percentage of stories with rating >= 4
      const successCount = stories.filter(s => s.rating >= 4).length;
      const successRate = stories.length > 0 ? Math.round((successCount / stories.length) * 100) : 0;

      // Total Earnings Shared: parse dollar amounts from story texts
      let totalEarnings = 0;
      stories.forEach(s => {
        const matches = s.story.match(/\$?[\d,]+(\.\d{2})?/g);
        if (matches) {
          matches.forEach(match => {
            const num = parseFloat(match.replace(/[$,]/g, ''));
            if (!isNaN(num)) {
              totalEarnings += num;
            }
          });
        }
      });

      // Format totalEarnings
      let formattedEarnings = '$0';
      if (totalEarnings > 1000000) {
        formattedEarnings = `$${(totalEarnings / 1000000).toFixed(1)}M`;
      } else if (totalEarnings > 1000) {
        formattedEarnings = `$${(totalEarnings / 1000).toFixed(1)}K`;
      } else {
        formattedEarnings = `$${totalEarnings.toFixed(0)}`;
      }

      setAppStats({
        activeReaders: uniqueReaders,
        totalEarnings: formattedEarnings,
        successRate: `${successRate}%`
      });
    };

    fetchAndComputeStats();
  }, [isLoading, stories, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-blue-600 text-2xl font-bold">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 py-8 md:px-6 md:py-12 text-white space-y-12 pt-20">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -translate-y-24 translate-x-24 blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-10 rounded-full translate-y-24 -translate-x-24 blur-xl"></div>
            <div className="relative z-10 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 flex items-center justify-center md:justify-start">
                Hi {userName}! <span className="ml-2 animate-wave">👋</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl mb-6">Ready for today's hustle inspiration?</p>
              <div className="bg-white bg-opacity-20 rounded-2xl p-4 mb-8 backdrop-blur-md max-w-2xl mx-auto md:mx-0">
                <p className="text-base sm:text-lg italic transition-all duration-500">
                  "{motivationalQuotes[currentQuote]}"
                </p>
              </div>
              <button onClick={handleReadTodaysFeatured} className="bg-white text-blue-600 px-6 sm:px-8 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all duration-300 hover:scale-105 shadow-md">
                Read Today's Featured Story 🚀
              </button>
            </div>
          </div>

          {/* User Progress Snapshot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="text-xl sm:text-2xl">📚</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{weeklyStats.storiesRead}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">Stories Read</p>
              <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(weeklyStats.storiesRead / 50) * 100}%` }} // Assuming max 50 for animation
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="text-xl sm:text-2xl">🎯</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{weeklyStats.categoriesExplored}/{categories.length}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">Categories Explored</p>
              <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${(weeklyStats.categoriesExplored / categories.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Flame className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="text-xl sm:text-2xl">🔥</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{weeklyStats.readingStreak}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">Day Reading Streak</p>
              <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${Math.min(weeklyStats.readingStreak * 10, 100)}%` }} // 10% per day, max 10 days
                ></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl hover:shadow-2xl transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                  <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                </div>
                <span className="text-xl sm:text-2xl">💾</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-1">{savedStories.size}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3">Saved Stories</p>
              <button onClick={handleViewAllSaved} className="mt-2 text-blue-600 text-xs sm:text-sm font-medium hover:underline transition-colors">View All →</button>
            </div>
          </div>

          {/* Featured Stories */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">🌟 Featured Stories</h2>
              <div className="flex space-x-2">
                <span className="bg-red-100 text-red-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">Trending</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-medium">Editor's Pick</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {featuredStories.map((story) => (
                <div key={story.id} className="group bg-white rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border border-gray-100 hover:border-blue-200">
                  {story.trending && (
                    <div className="flex items-center mb-2 sm:mb-3">
                      <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 mr-1 animate-pulse" />
                      <span className="text-red-500 text-xs sm:text-sm font-medium">Trending</span>
                    </div>
                  )}
                  <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">{story.image}</div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-3">{story.snippet}</p>
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                    <span className="bg-blue-100 text-blue-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs">
                      {story.category}
                    </span>
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <span className="flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {story.readTime}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        {story.viewsStr}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Link href={`/stories/${story.id}`} className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors">
                      Read Story
                    </Link>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSaveStory(story.id);
                      }}
                      className={`p-1 sm:p-2 rounded-full transition-all duration-300 ${
                        savedStories.has(story.id) 
                          ? 'bg-yellow-100 text-yellow-600 rotate-12' 
                          : 'bg-gray-100 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 hover:rotate-12'
                      }`}
                    >
                      <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" fill={savedStories.has(story.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Categories Shortcut */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">🎯 Explore Categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {categories.map((category: Category, index) => (
                <div key={index} onClick={() => handleCategoryClick(category.id)} className="group bg-white border border-gray-100 rounded-2xl p-4 sm:p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 cursor-pointer hover:border-blue-300">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110">{category.icon}</div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                    {category.name}
                  </h3>
                  <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3">{category.count} stories</p>
                  <div className={`mt-2 sm:mt-3 h-1 ${category.color || 'bg-blue-500'} rounded-full opacity-60 group-hover:opacity-100 transition-opacity`}></div>
                </div>
              ))}
            </div>
          </div>

          {/* Community Insights & Saved Stories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            
            {/* Community Insights */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 flex items-center">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 mr-3" />
                Community Insights
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 sm:p-5 backdrop-blur-md hover:bg-opacity-30 transition-all">
                  <h3 className="font-semibold mb-1 text-base sm:text-lg">Most Viewed This Week</h3>
                  <p className="text-sm sm:text-base opacity-90">{communityInsights.mostViewed || 'Loading...'}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 sm:p-5 backdrop-blur-md hover:bg-opacity-30 transition-all">
                  <h3 className="font-semibold mb-1 text-base sm:text-lg">Top Category Right Now</h3>
                  <p className="text-sm sm:text-base opacity-90">🔥 {communityInsights.topCategory || 'Loading...'}</p>
                </div>
                <div className="bg-white bg-opacity-20 rounded-2xl p-4 sm:p-5 backdrop-blur-md hover:bg-opacity-30 transition-all">
                  <h3 className="font-semibold mb-1 text-base sm:text-lg">Motivation Meter</h3>
                  <p className="text-sm sm:text-base opacity-90">🚀 {communityInsights.motivationMeter} people found inspiration today!</p>
                </div>
              </div>
            </div>

            {/* Saved Stories */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 flex items-center">
                <Bookmark className="w-6 h-6 sm:w-7 sm:h-7 mr-3 text-blue-600" />
                Your Saved Stories
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {savedStoriesList.map((story) => (
                  <Link key={story.id} href={`/stories/${story.id}`} className="flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group">
                    <div className="text-2xl sm:text-3xl transition-transform group-hover:scale-110">{story.image}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base sm:text-lg text-gray-800 group-hover:text-blue-600 transition-colors">{story.title}</h3>
                      <p className="text-xs sm:text-sm text-gray-500">{story.category} • {story.readTime}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
                {savedStories.size === 0 && (
                  <div className="text-center py-8 sm:py-12 text-gray-500">
                    <Bookmark className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-50" />
                    <p className="text-base sm:text-lg">No saved stories yet. Start saving your favorites!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Achievements & Badges - Made more visible and stunning */}
          <div className="bg-gradient-to-r from-blue-400 to-indigo-500 rounded-3xl p-6 sm:p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-32 -translate-y-32 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-32 translate-y-32 blur-3xl"></div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 flex items-center relative z-10">
              <Trophy className="w-8 h-8 sm:w-10 sm:h-10 mr-3 sm:mr-4 text-yellow-300" />
              Your Achievements
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 relative z-10">
              {updatedBadges.map((badge, index) => (
                <div 
                  key={index} 
                  className={`bg-white bg-opacity-30 backdrop-blur-lg rounded-2xl p-4 sm:p-6 text-center transition-all duration-500 hover:scale-110 hover:rotate-3 shadow-lg hover:shadow-2xl ${
                    badge.earned ? 'ring-4 ring-yellow-300 ring-opacity-70 animate-pulse' : 'opacity-80'
                  }`}
                >
                  <div className="text-4xl sm:text-6xl mb-2 sm:mb-3">{badge.icon}</div>
                  <h3 className="font-bold text-base sm:text-lg mb-1 sm:mb-2">{badge.name}</h3>
                  <p className="text-xs sm:text-sm opacity-90 mb-2 sm:mb-3">{badge.description}</p>
                  {badge.earned && (
                    <span className="bg-yellow-400 text-blue-900 px-3 py-1 sm:px-4 sm:py-1 rounded-full text-xs sm:text-sm font-bold shadow-md">Earned! 🎉</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Search & Quick Actions */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Find Your Next Inspiration</h2>
                <div className="relative">
                  <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
                  <input 
                    type="text" 
                    placeholder="Search for hustle stories, keywords, or categories..."
                    className="w-full pl-8 sm:pl-12 pr-4 py-3 sm:py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-300 focus:outline-none transition-all focus:shadow-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-end">
                <button onClick={() => setActiveFilter('Trending')} className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 ${activeFilter === 'Trending' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow'}`}>
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-base">Trending</span>
                </button>
                <button onClick={() => setActiveFilter('New')} className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 ${activeFilter === 'New' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow'}`}>
                  <Zap className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-base">New</span>
                </button>
                <button onClick={() => setActiveFilter('Popular')} className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 ${activeFilter === 'Popular' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow'}`}>
                  <Star className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-base">Popular</span>
                </button>
                <button onClick={() => setActiveFilter('Quick Reads')} className={`flex items-center space-x-1 sm:space-x-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full transition-all duration-300 ${activeFilter === 'Quick Reads' ? 'bg-blue-600 text-white shadow-md' : 'bg-blue-100 text-blue-600 hover:bg-blue-200 hover:shadow'}`}>
                  <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs sm:text-base">Quick Reads</span>
                </button>
              </div>
            </div>
          </div>

          {/* Call to Action Section - Made more visible and better */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg">
              <PlusCircle className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 text-yellow-300" />
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Share Your Story</h3>
              <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-6">Inspire others with your hustle journey</p>
              <button onClick={handleSubmitStory} className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:bg-opacity-90 transition-colors shadow-md">
                Submit Story
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg">
              <Share2 className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 text-yellow-300" />
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Share with Friends</h3>
              <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-6">Spread the hustle inspiration</p>
              <button onClick={handleShareApp} className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:bg-opacity-90 transition-colors shadow-md">
                Share App
              </button>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer shadow-lg">
              <Heart className="w-12 h-12 sm:w-16 sm:h-16 mb-4 sm:mb-6 text-yellow-300" />
              <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">Daily Hustle Mail</h3>
              <p className="text-sm sm:text-base opacity-90 mb-4 sm:mb-6">Get daily motivation in your inbox</p>
              <button onClick={handleSubscribe} className="bg-white text-blue-600 px-4 py-2 sm:px-6 sm:py-3 rounded-full text-sm sm:text-base font-bold hover:bg-opacity-90 transition-colors shadow-md">
                Subscribe
              </button>
            </div>
          </div>

          {/* Inspiration Corner */}
          <div className="bg-gradient-to-r from-blue-800 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 flex items-center">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 mr-3" />
              Inspiration Corner
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 sm:p-6 hover:bg-opacity-20 transition-all">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">💡 Hustle Fact of the Day</h3>
                <p className="text-base sm:text-lg italic transition-all duration-500">
                  {hustleFacts[currentFact]}
                </p>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-4 sm:p-6 hover:bg-opacity-20 transition-all">
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">🎬 Quick Motivation</h3>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="30-second success story text-xs sm:text-sm mb-1 sm:mb-2">30-Second Success Story</p>
                    <p className="text-base sm:text-lg font-semibold">"The Uber Driver's $1M App"</p>
                  </div>
                  <button onClick={handlePlayVideo} className="bg-white bg-opacity-20 p-3 sm:p-4 rounded-full hover:bg-opacity-30 transition-all hover:scale-110">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* More Stories Grid */}
          <div className="bg-white rounded-3xl p-4 sm:p-6 md:p-8 shadow-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4 sm:mb-6">More Stories You'll Love</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {moreStories.map((story) => (
                <Link key={story.id} href={`/stories/${story.id}`} className="group flex items-center space-x-3 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                  <div className="text-3xl sm:text-4xl transition-transform group-hover:scale-110">{story.image}</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-gray-800 group-hover:text-blue-600 transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{story.snippet}</p>
                    <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                      <span className="bg-blue-100 text-blue-600 px-1 py-0.5 sm:px-2 sm:py-1 rounded-full">
                        {story.category}
                      </span>
                      <span>{story.readTime}</span>
                      <span>{story.viewsStr} views</span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleSaveStory(story.id);
                    }}
                    className={`p-1 sm:p-2 rounded-full transition-all duration-300 ${
                      savedStories.has(story.id) 
                        ? 'bg-yellow-100 text-yellow-600' 
                        : 'bg-gray-200 text-gray-400 hover:bg-yellow-100 hover:text-yellow-600 hover:rotate-12'
                    }`}
                  >
                    <Bookmark className="w-3 h-3 sm:w-4 sm:h-4" fill={savedStories.has(story.id) ? 'currentColor' : 'none'} />
                  </button>
                </Link>
              ))}
            </div>
          </div>

          {/* Footer with Stats */}
          <div className="bg-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 text-center">
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2">{stories.length}</div>
                <div className="text-sm sm:text-base text-blue-100">Total Stories</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2">{appStats.activeReaders}</div>
                <div className="text-sm sm:text-base text-blue-100">Active Readers</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2">{appStats.totalEarnings}</div>
                <div className="text-sm sm:text-base text-blue-100">Total Earnings Shared</div>
              </div>
              <div>
                <div className="text-3xl sm:text-4xl font-bold text-blue-300 mb-2">{appStats.successRate}</div>
                <div className="text-sm sm:text-base text-blue-100">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
        {showComingSoon && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 sm:p-4 rounded-lg shadow-lg animate-fade-in">
            Coming Soon!
          </div>
        )}
      </div>
      <SubmitStoryModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onSubmitted={handleStorySubmitted}
      />
      <Footer />
    </>
  );
};

export default SideHustleSnapsDashboard;