"use client";

import { useState } from "react";
import { ChevronDown } from "./ChevronDown";

interface SearchAndFilterProps {
  search: string;
  onSearchChange: (value: string) => void;
  selectedTopic: string;
  onTopicChange: (value: string) => void;
  selectedPlatform: string;
  onPlatformChange: (value: string) => void;
  selectedGender: string;
  onGenderChange: (value: string) => void;
  topics: string[];
  platforms: string[];
  genders: string[];
  isLoading: boolean;
}

export function SearchAndFilter({
  search,
  onSearchChange,
  selectedTopic,
  onTopicChange,
  selectedPlatform,
  onPlatformChange,
  selectedGender,
  onGenderChange,
  topics,
  platforms,
  genders,
  isLoading,
}: SearchAndFilterProps) {
  const [topicOpen, setTopicOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [genderOpen, setGenderOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4 mb-6">
      {/* Search */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search Influencers
        </label>
        <input
          type="text"
          placeholder="Search by name or location..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          disabled={isLoading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Topic Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Topic
          </label>
          <div className="relative">
            <select
              value={selectedTopic}
              onChange={(e) => {
                onTopicChange(e.target.value);
                setTopicOpen(false);
              }}
              onMouseDown={() => setTopicOpen(!topicOpen)}
              onBlur={() => setTopicOpen(false)}
              disabled={isLoading}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-50 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Topics</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
            <ChevronDown
              isOpen={topicOpen}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Platform Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Platform
          </label>
          <div className="relative">
            <select
              value={selectedPlatform}
              onChange={(e) => {
                onPlatformChange(e.target.value);
                setPlatformOpen(false);
              }}
              onMouseDown={() => setPlatformOpen(!platformOpen)}
              onBlur={() => setPlatformOpen(false)}
              disabled={isLoading}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Platforms</option>
              {platforms.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            <ChevronDown
              isOpen={platformOpen}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>

        {/* Gender Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gender
          </label>
          <div className="relative">
            <select
              value={selectedGender}
              onChange={(e) => {
                onGenderChange(e.target.value);
                setGenderOpen(false);
              }}
              onMouseDown={() => setGenderOpen(!genderOpen)}
              onBlur={() => setGenderOpen(false)}
              disabled={isLoading}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white cursor-pointer"
            >
              <option value="">All Genders</option>
              {genders.map((gender) => (
                <option key={gender} value={gender}>
                  {gender.charAt(0) + gender.slice(1).toLowerCase().replace('_', '-')}
                </option>
              ))}
            </select>
            <ChevronDown
              isOpen={genderOpen}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
