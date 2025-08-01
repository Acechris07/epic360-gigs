'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star, MessageSquare, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import { ReviewSystem } from '@/components/review-system';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  reviewee: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  order: {
    id: string;
    gig: {
      title: string;
    } | null;
  };
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('received');

  useEffect(() => {
    if (user) {
      loadReviews();
    }
  }, [user, activeTab]);

  const loadReviews = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeTab === 'received') {
        params.append('userId', user.id);
      } else {
        // For reviews given, we'll need to filter on the frontend
        params.append('userId', user.id);
      }

      const response = await fetch(`/api/reviews?${params}`);
      const data = await response.json();

      if (response.ok) {
        let filteredReviews = data.reviews || [];

        if (activeTab === 'given') {
          // Filter reviews where the current user is the reviewer
          filteredReviews = filteredReviews.filter(
            (review: Review) => review.reviewer.id === user.id
          );
        } else {
          // Filter reviews where the current user is the reviewee
          filteredReviews = filteredReviews.filter(
            (review: Review) => review.reviewee.id === user.id
          );
        }

        setReviews(filteredReviews);
      } else {
        console.error('Failed to fetch reviews:', data.error);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">
            Please sign in to view your reviews
          </h1>
          <Link href="/auth/signin">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Reviews</h1>
        <p className="text-gray-600">
          Manage and view reviews for your work and services
        </p>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Reviews Received</TabsTrigger>
          <TabsTrigger value="given">Reviews Given</TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews received yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete some orders to start receiving reviews from
                    clients.
                  </p>
                  <Link href="/orders">
                    <Button>View Orders</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {review.reviewer.avatar_url ? (
                          <img
                            src={review.reviewer.avatar_url}
                            alt={review.reviewer.full_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {review.reviewer.full_name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(review.created_at)}
                          </Badge>
                        </div>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        {review.comment && (
                          <p className="text-gray-700 text-sm mb-2">
                            {review.comment}
                          </p>
                        )}
                        {review.order.gig && (
                          <p className="text-xs text-gray-500">
                            For: {review.order.gig.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="given" className="mt-6">
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Loading reviews...</p>
              </div>
            ) : reviews.length === 0 ? (
              <Card>
                <CardContent className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No reviews given yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Complete some orders to start leaving reviews for
                    freelancers.
                  </p>
                  <Link href="/orders">
                    <Button>View Orders</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              reviews.map(review => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        {review.reviewee.avatar_url ? (
                          <img
                            src={review.reviewee.avatar_url}
                            alt={review.reviewee.full_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-500" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            Review for {review.reviewee.full_name}
                          </h4>
                          <Badge variant="secondary" className="text-xs">
                            {formatDate(review.created_at)}
                          </Badge>
                        </div>
                        <div className="mb-2">{renderStars(review.rating)}</div>
                        {review.comment && (
                          <p className="text-gray-700 text-sm mb-2">
                            {review.comment}
                          </p>
                        )}
                        {review.order.gig && (
                          <p className="text-xs text-gray-500">
                            For: {review.order.gig.title}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
