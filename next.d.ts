import { NextPage } from 'next';

declare module 'next/app' {
  interface PageProps {
    params?: { id: string };
  }
}

declare module 'next/navigation' {
  interface PageProps {
    params?: { id: string };
  }
}