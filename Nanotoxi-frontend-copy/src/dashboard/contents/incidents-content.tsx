"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Mail, User, Calendar, MessageSquare, FlaskConical, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchNanoparticleTypes, fetchContactRequests, type NanoparticleType, type ContactRequest } from "@/lib/api";

const cardShadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px";

export function IncidentsContent() {
  const [nanoparticles, setNanoparticles] = useState<NanoparticleType[]>([]);
  const [contactRequests, setContactRequests] = useState<ContactRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [nanoData, contactData] = await Promise.all([
          fetchNanoparticleTypes(),
          fetchContactRequests()
        ]);
        setNanoparticles(nanoData);
        setContactRequests(contactData);
      } catch (error) {
        console.error("Failed to load data:", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const filteredNanoparticles = nanoparticles.filter(n => 
    n.nanoparticle_id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-180px)]">
      {/* Left Panel: Nanoparticle Types */}
      <div className="w-[400px] flex flex-col shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search nanoparticles..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" className="shrink-0 bg-transparent">
            <Filter className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 pr-2">
          {filteredNanoparticles.map((nano, idx) => (
            <div
              key={idx}
              className="w-full text-left p-4 rounded-2xl border bg-card border-border hover:border-primary/20 transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 text-[10px] font-semibold uppercase rounded-full bg-blue-500/10 text-blue-500 flex items-center gap-1">
                  <FlaskConical className="w-3 h-3" />
                  Nanoparticle
                </span>
                <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                  <Hash className="w-3 h-3" />
                  Count: {nano.count}
                </span>
              </div>
              <p className="text-lg font-bold text-foreground mb-1">
                {nano.nanoparticle_id}
              </p>
            </div>
          ))}
          {filteredNanoparticles.length === 0 && (
            <div className="text-center text-muted-foreground py-8 text-sm">
              No nanoparticles found.
            </div>
          )}
        </div>
      </div>

      {/* Right Panel: Contact Requests */}
      <div 
        className="flex-1 bg-card rounded-2xl border border-border p-6 overflow-y-auto"
        style={{ boxShadow: cardShadow }}
      >
        <div className="flex items-start justify-between mb-6 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Contact Requests
            </h2>
            <p className="text-sm text-muted-foreground">
              Recent inquiries and messages from users
            </p>
          </div>
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">
            {contactRequests.length} Total
          </div>
        </div>

        <div className="space-y-4">
          {contactRequests.map((req, idx) => (
            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {req.name ? req.name.charAt(0).toUpperCase() : "?"}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{req.name || "Unknown"}</h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {req.email}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1 bg-background px-2 py-1 rounded-md border border-border">
                  <Calendar className="w-3 h-3" />
                  {req.timestamp ? new Date(req.timestamp).toLocaleString() : "Unknown date"}
                </div>
              </div>
              
              <div className="bg-background p-4 rounded-lg border border-border">
                <div className="flex items-center gap-2 mb-2 text-sm font-medium text-foreground">
                  <MessageSquare className="w-4 h-4 text-muted-foreground" />
                  Message
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {req.message}
                </p>
              </div>
            </div>
          ))}
          
          {contactRequests.length === 0 && (
            <div className="text-center text-muted-foreground py-12">
              <Mail className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No contact requests available.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
