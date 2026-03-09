"use client";

import { useState } from "react";
import { Send, FileJson, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const API_BASE_URL = "https://web-production-6a673.up.railway.app";

export function ServicesContent() {
  const [activeTab, setActiveTab] = useState("contact");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);

  // Forms State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
    profession: "",
    phone: ""
  });

  const [datasetForm, setDatasetForm] = useState({
    name: "",
    email: "",
    dataset_description: "",
    organization: "",
    dataset_size: "",
    research_area: ""
  });

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(contactForm),
      });

      setStatus(res.status);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
      setStatus(500);
      setResponse({ error: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);
    setStatus(null);

    try {
      const res = await fetch(`${API_BASE_URL}/share-dataset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datasetForm),
      });

      setStatus(res.status);
      const data = await res.json();
      setResponse(data);
    } catch (error) {
      console.error(error);
      setStatus(500);
      setResponse({ error: "Failed to connect to server" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex gap-6">
      {/* Left Panel: Forms */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="contact">Contact Request</TabsTrigger>
            <TabsTrigger value="dataset">Share Dataset</TabsTrigger>
          </TabsList>

          {/* Contact Form */}
          <TabsContent value="contact" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">POST /contact</span>
                </CardTitle>
                <CardDescription>Submit a general inquiry or contact request.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-name">Name *</Label>
                      <Input 
                        id="c-name" 
                        required 
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({...contactForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-email">Email *</Label>
                      <Input 
                        id="c-email" 
                        type="email" 
                        required 
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({...contactForm, email: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="c-pro">Profession</Label>
                      <Input 
                        id="c-pro" 
                        placeholder="Researcher"
                        value={contactForm.profession}
                        onChange={(e) => setContactForm({...contactForm, profession: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="c-phone">Phone</Label>
                      <Input 
                        id="c-phone" 
                        placeholder="+1 234..."
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({...contactForm, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="c-msg">Message *</Label>
                    <Textarea 
                      id="c-msg" 
                      required 
                      placeholder="Your message here..." 
                      className="resize-none h-32"
                      value={contactForm.message}
                      onChange={(e) => setContactForm({...contactForm, message: e.target.value})}
                    />
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Send Request
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dataset Form */}
          <TabsContent value="dataset" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-primary font-mono text-sm bg-primary/10 px-2 py-1 rounded">POST /share-dataset</span>
                </CardTitle>
                <CardDescription>Share a dataset contribution with the NanoTox AI lab.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDatasetSubmit} className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="d-name">Name *</Label>
                      <Input 
                        id="d-name" 
                        required 
                        placeholder="Dr. Jane Smith"
                        value={datasetForm.name}
                        onChange={(e) => setDatasetForm({...datasetForm, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="d-email">Email *</Label>
                      <Input 
                        id="d-email" 
                        type="email" 
                        required 
                        placeholder="jane.smith@university.edu"
                        value={datasetForm.email}
                        onChange={(e) => setDatasetForm({...datasetForm, email: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="d-org">Organization</Label>
                      <Input 
                        id="d-org" 
                        placeholder="University of Science"
                        value={datasetForm.organization}
                        onChange={(e) => setDatasetForm({...datasetForm, organization: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="d-area">Research Area</Label>
                      <Input 
                        id="d-area" 
                        placeholder="Nanotoxicology"
                        value={datasetForm.research_area}
                        onChange={(e) => setDatasetForm({...datasetForm, research_area: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="d-size">Dataset Size</Label>
                    <Input 
                      id="d-size" 
                      placeholder="e.g. 500MB, 10k rows"
                      value={datasetForm.dataset_size}
                      onChange={(e) => setDatasetForm({...datasetForm, dataset_size: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="d-desc">Dataset Description *</Label>
                    <Textarea 
                      id="d-desc" 
                      required 
                      placeholder="Describe the dataset methodology and contents..." 
                      className="resize-none h-32"
                      value={datasetForm.dataset_description}
                      onChange={(e) => setDatasetForm({...datasetForm, dataset_description: e.target.value})}
                    />
                  </div>

                   <Button type="submit" disabled={loading} className="w-full">
                    {loading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" /> : <Send className="w-4 h-4 mr-2" />}
                    Submit Dataset
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Right Panel: Console */}
      <div className="w-[400px] shrink-0 flex flex-col gap-4">
        <Card className="h-full flex flex-col bg-muted/30 border-2 overflow-hidden">
          <CardHeader className="py-3 px-4 border-b bg-muted/50 flex flex-row items-center justify-between space-y-0">
             <div className="flex items-center gap-2">
               <Terminal className="w-4 h-4 text-muted-foreground" />
               <span className="text-sm font-semibold">Response Console</span>
             </div>
             {status && (
               <Badge variant={status >= 200 && status < 300 ? "default" : "destructive"}>
                 Status: {status}
               </Badge>
             )}
          </CardHeader>
          <CardContent className="flex-1 p-0 relative font-mono text-sm">
            <ScrollArea className="h-full">
              <div className="p-4">
                {response ? (
                  <pre className="whitespace-pre-wrap break-all text-xs text-secondary-foreground">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-muted-foreground p-8 text-center opacity-50">
                    <FileJson className="w-8 h-8 mb-2" />
                    <span>Response payload will appear here...</span>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
