'use client';

import { runFormSubmission } from "@/actions/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ClipLoader } from "react-spinners";
import { z } from 'zod';

interface GitHubContributorCardProps {
  username: string;
  links: string[];
  commits: number;
}

const GitHubContributorCard = ({ username, links, commits }: GitHubContributorCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Link href={`https://github.com/${username}`} target="_blank">
          {username}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          {links.map((link, index) => (
            <div key={index}>
              {link}
            </div>
          ))}
        </div>
        <div>
          Commits: {commits}
        </div>
      </CardContent>
    </Card>
  );
};

const formSchema = z.object({
  repos: z.string().array(),
  topic: z.string()
});

export const SubmitForm = () => {
  const [loading, setLoading] = useState(false);
  const [resp, setResp] = useState<{
    name: string,
    files: string[],
    commits: number
  }[]>()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repos: [],
      topic: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const result = await runFormSubmission(values.topic);
    console.log(result);
    setResp(result);
    setLoading(false);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2 pl-5">
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem className="w-[400px]">
                <FormControl>
                  <Input placeholder="auth, server actions, infrastructure, etc." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={loading} type="submit">
            {loading ? (
              <div className="flex items-center justify-center">
                <ClipLoader size={20} color="#ffffff" />
                <span className="ml-2">Loading...</span>
              </div>
            ) : (
              "Submit"
            )}
          </Button>
        </form>
      </Form>
      {resp && <p className="text-3xl">Contributors</p>}

      <div className="grid grid-cols-4 gap-4 p-10">
        {resp && resp.map((r, i) => (
          <GitHubContributorCard key={i} username={r.name} links={r.files} commits={r.commits} />
        ))}
      </div>

      {loading && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="flex items-center justify-center mb-4">
              <ClipLoader size={40} color="#1a202c" />
              <span className="ml-4 text-2xl font-bold">Loading...</span>
            </div>
            <p className="text-gray-600">Please wait while we fetch the data.</p>
          </div>
        </div>
      )}

      {JSON.stringify(resp)}
    </div>
  )
}