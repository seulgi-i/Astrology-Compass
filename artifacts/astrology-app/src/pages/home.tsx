import React, { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useAnalyzeAstrology, useHealthCheck } from "@workspace/api-client-react";
import { AstrologyRequestGender } from "@workspace/api-client-react/src/generated/api.schemas";
import { useAstrologyStore } from "@/lib/astrology-context";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { AlertCircle } from "lucide-react";

const formSchema = z.object({
  birthDate: z.string().min(1, "Birth date is required"),
  birthTime: z.string().min(1, "Birth time is required"),
  gender: z.enum(["male", "female"] as const),
  birthPlace: z.string().min(1, "Birth place is required"),
});

type FormValues = z.infer<typeof formSchema>;

export default function Home() {
  const [, setLocation] = useLocation();
  const { setRequest, setAnalysis } = useAstrologyStore();
  const { data: health } = useHealthCheck();
  
  const analyzeMutation = useAnalyzeAstrology();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: "",
      birthTime: "12:00",
      gender: "male",
      birthPlace: "Seoul, South Korea",
    },
  });

  const onSubmit = (data: FormValues) => {
    setRequest(data);
    analyzeMutation.mutate(
      { data },
      {
        onSuccess: (result) => {
          setAnalysis(result);
          setLocation("/result");
        },
      }
    );
  };

  return (
    <div className="min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 relative overflow-hidden starlight-grid">
      {/* Ambient background glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="w-full max-w-xl z-10"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4 font-serif text-transparent bg-clip-text bg-gradient-to-b from-primary to-primary/60">
              Celestial Oracle
            </h1>
          </motion.div>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Consult the ancient stars. Enter your birth details to reveal your Saju destiny and Vedic path.
          </p>
        </div>

        <Card className="bg-card/40 backdrop-blur-xl border-border/50 mystic-border cosmic-glow">
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80 uppercase tracking-widest text-xs">Date of Birth</FormLabel>
                        <FormControl>
                          <Input type="date" className="bg-background/50 border-primary/20 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="birthTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80 uppercase tracking-widest text-xs">Time of Birth</FormLabel>
                        <FormControl>
                          <Input type="time" className="bg-background/50 border-primary/20 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80 uppercase tracking-widest text-xs">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-background/50 border-primary/20 focus-visible:ring-primary">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthPlace"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary/80 uppercase tracking-widest text-xs">Birth Place</FormLabel>
                        <FormControl>
                          <Input placeholder="City, Country" className="bg-background/50 border-primary/20 focus-visible:ring-primary" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {analyzeMutation.isError && (
                  <div className="p-4 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">Failed to divine the stars. Please try again.</p>
                  </div>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-serif tracking-widest hover-elevate-2 relative overflow-hidden group border border-primary/30"
                  disabled={analyzeMutation.isPending}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  {analyzeMutation.isPending ? (
                    <span className="flex items-center gap-2">
                      <Spinner className="w-5 h-5" /> Reading the Heavens...
                    </span>
                  ) : (
                    "Reveal Destiny"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {health?.status && (
          <p className="text-center text-xs text-muted-foreground/50 mt-8 font-mono">
            Oracle Status: {health.status}
          </p>
        )}
      </motion.div>
    </div>
  );
}
