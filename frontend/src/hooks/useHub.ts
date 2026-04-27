import { useState, useEffect, useRef } from "react";
import { Event } from "../types";

export const useHub = (events: Event[], initialFeatured: Event) => {
  const eventsRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [mostPopular, setMostPopular] = useState<Event | null>(null);
  const featuredEvents = events.slice(0, 3);
  const featured = featuredEvents[featuredIndex] || initialFeatured;

  useEffect(() => {
    // Mocking finding most popular
    setMostPopular(events[2]);
  }, [events]);

  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % featuredEvents.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredEvents.length]);

  const categories = ["All", "Tech", "Business", "Art", "Sports"];

  const filteredEvents = events.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || e.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const scrollToEvents = () => {
    eventsRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return {
    eventsRef,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    featured,
    mostPopular,
    categories,
    filteredEvents,
    scrollToEvents
  };
};
