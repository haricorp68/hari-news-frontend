"use client";
import { useState } from "react";
import { NewsSummaryCardList } from "@/components/post/NewsSummaryCardList";
import { useNewsPosts } from "@/lib/modules/post/hooks/useNewsPosts";

export default function Home() {
  const [params, setParams] = useState({
    page: 1,
    pageSize: 20,
    categoryId: "",
    tagIds: [] as string[],
    fromDate: "",
    toDate: "",
  });

  const { posts, postsLoading } = useNewsPosts(params);

  const handleFilterChange = (
    key: keyof typeof params,
    value: string | string[]
  ) => {
    setParams((prev) => ({
      ...prev,
      [key]: value,
      page: 1, // Reset to first page on filter change
    }));
  };

  return (
    <div className="max-w-2xl mx-auto py-8 grid gap-6">
      {/* Filter Bar */}
      <div className="flex flex-col gap-4 p-4 bg-gray-100 rounded-lg">
        <div className="flex gap-4 flex-wrap">
          {/* Category Filter */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-medium">
              Category
            </label>
            <h1>HAHAHAHAHAHAHAHAHAHAHA</h1>
            <select
              id="category"
              value={params.categoryId}
              onChange={(e) => handleFilterChange("categoryId", e.target.value)}
              className="p-2 border rounded"
            >
              <option value="">All Categories</option>
              <option value="fe44a1e5-ef65-411c-ab33-8d39a4126a1a">News</option>
              <option value="another-category-id">Tech</option>
              <option value="yet-another-category-id">Science</option>
              {/* Add more categories as needed */}
            </select>
          </div>

          {/* Tags Filter */}
          <div className="flex flex-col">
            <label htmlFor="tags" className="text-sm font-medium">
              Tags
            </label>
            <select
              id="tags"
              multiple
              value={params.tagIds}
              onChange={(e) =>
                handleFilterChange(
                  "tagIds",
                  Array.from(e.target.selectedOptions, (option) => option.value)
                )
              }
              className="p-2 border rounded"
            >
              <option value="8a809869-e26c-4e4c-a090-b132bf99f334">Tech</option>
              <option value="another-tag-id">Science</option>
              <option value="yet-another-tag-id">Politics</option>
              {/* Add more tags as needed */}
            </select>
          </div>

          {/* DateTime Range Filters */}
          <div className="flex flex-col">
            <label htmlFor="fromDate" className="text-sm font-medium">
              From Date & Time
            </label>
            <input
              id="fromDate"
              type="datetime-local"
              value={params.fromDate}
              onChange={(e) => handleFilterChange("fromDate", e.target.value)}
              className="p-2 border rounded"
              step="1" // Allows seconds precision
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="toDate" className="text-sm font-medium">
              To Date & Time
            </label>
            <input
              id="toDate"
              type="datetime-local"
              value={params.toDate}
              onChange={(e) => handleFilterChange("toDate", e.target.value)}
              className="p-2 border rounded"
              step="1" // Allows seconds precision
            />
          </div>
        </div>
        {/* Clear Filters Button */}
        <button
          onClick={() =>
            setParams({
              page: 1,
              pageSize: 20,
              categoryId: "",
              tagIds: [],
              fromDate: "",
              toDate: "",
            })
          }
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Filters
        </button>
      </div>

      {/* News Summary Card List */}
      <NewsSummaryCardList posts={posts || []} loading={postsLoading} />
    </div>
  );
}
