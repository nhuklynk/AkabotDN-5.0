"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ShareButtonsProps {
  postTitle: string;
}

export function ShareButtons({ postTitle }: ShareButtonsProps) {
  const handleFacebookShare = () => {
    const url = window.location.href;
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleTwitterShare = () => {
    const url = window.location.href;
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(postTitle)}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  const handleLinkedInShare = () => {
    const url = window.location.href;
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Chia sẻ bài viết</h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent hover:bg-blue-50 hover:text-blue-600"
            onClick={handleFacebookShare}
          >
            Facebook
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent hover:bg-sky-50 hover:text-sky-600"
            onClick={handleTwitterShare}
          >
            Twitter
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 bg-transparent hover:bg-blue-50 hover:text-blue-600"
            onClick={handleLinkedInShare}
          >
            LinkedIn
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
