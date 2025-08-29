// app/stories/page.tsx (server component)
import { Suspense } from 'react';
import StoriesContent from './StoriesContent';

export default function SideHustleStoriesPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-muted-foreground">Loading stories...</div>}>
      <StoriesContent />
    </Suspense>
  );
}