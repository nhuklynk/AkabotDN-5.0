"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "@/hooks/useLocale";

type PostFormData = {
  title: string;
  slug: string;
  summary: string;
  content: string;
  status: string;
  user_id: string;
  post_status: string;
  published_at: string;
  post_type: string;
  category_id: string;
};

type Option = { id: number; name: string };

type Props = {
  formData: PostFormData;
  setFormData: React.Dispatch<React.SetStateAction<PostFormData>>;
  authors: Option[];
  categories: Option[];
  onTitleChange: (title: string) => void;
  mode: "create" | "edit";
  statusHistory?: { status: string; at: string; by?: string; note?: string }[];
};

export default function PostFormDialog({
  formData,
  setFormData,
  authors,
  categories,
  onTitleChange,
  mode,
  statusHistory,
}: Props) {
  const isCreate = mode === "create";
  const { t } = useLocale();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">{t("post.form.title")}</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => onTitleChange(e.target.value)}
            placeholder={t("post.form.titlePlaceholder")}
          />
        </div>
        <div>
          <Label htmlFor="slug">{t("post.form.slug")}</Label>
          <Input
            id="slug"
            value={formData.slug}
            onChange={(e) =>
              setFormData((d) => ({ ...d, slug: e.target.value }))
            }
            placeholder={t("post.form.slugPlaceholder")}
          />
        </div>
      </div>
      <div>
        <Label htmlFor="summary">{t("post.form.summary")}</Label>
        <Textarea
          id="summary"
          value={formData.summary}
          onChange={(e) =>
            setFormData((d) => ({ ...d, summary: e.target.value }))
          }
          placeholder={t("post.form.summaryPlaceholder")}
          rows={2}
        />
      </div>
      <div>
        <Label htmlFor="content">{t("post.form.content")}</Label>
        <RichTextEditor
          value={formData.content}
          onChange={(html) => setFormData((d) => ({ ...d, content: html }))}
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="user_id">{t("post.form.author")}</Label>
          <Select
            value={formData.user_id}
            onValueChange={(value) =>
              setFormData((d) => ({ ...d, user_id: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("post.form.authorPlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              {authors.map((a) => (
                <SelectItem key={a.id} value={a.id.toString()}>
                  {a.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="post_status">{t("post.form.postStatus")}</Label>
          <Select
            value={formData.post_status}
            onValueChange={(value) =>
              setFormData((d) => ({ ...d, post_status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("post.form.postStatusPlaceholder")} />
            </SelectTrigger>
                         <SelectContent>
               <SelectItem value="draft">{t("post.status.draft")}</SelectItem>
               <SelectItem value="published">
                 {t("post.status.published")}
               </SelectItem>
               <SelectItem value="archived">
                 {t("post.status.archived")}
               </SelectItem>
               <SelectItem value="scheduled">
                 {t("post.status.scheduled")}
               </SelectItem>
             </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="published_at">{t("post.form.publishedAt")}</Label>
          <Input
            id="published_at"
            type="date"
            value={formData.published_at}
            onChange={(e) =>
              setFormData((d) => ({ ...d, published_at: e.target.value }))
            }
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="post_type">{t("post.form.postType")}</Label>
          <Select
            value={formData.post_type}
            onValueChange={(value) =>
              setFormData((d) => ({ ...d, post_type: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder={t("post.form.postTypePlaceholder")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">{t("post.type.article")}</SelectItem>
              <SelectItem value="news">{t("post.type.news")}</SelectItem>
              <SelectItem value="event">{t("post.type.event")}</SelectItem>
              <SelectItem value="guide">{t("post.type.guide")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">{t("post.form.recordStatus")}</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData((d) => ({ ...d, status: value }))
            }
          >
            <SelectTrigger>
              <SelectValue
                placeholder={t("post.form.recordStatusPlaceholder")}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">
                {t("common.status.active")}
              </SelectItem>
              <SelectItem value="inactive">
                {t("common.status.inactive")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {!isCreate && statusHistory && statusHistory.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">
            {t("post.form.statusHistory")}
          </h4>
          <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
            {statusHistory.map((h, idx) => (
              <li key={idx}>
                <span className="font-medium text-foreground">{h.status}</span>{" "}
                · {new Date(h.at).toLocaleString()} {h.by ? `· ${h.by}` : ""}
                {h.note ? ` · ${h.note}` : ""}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
