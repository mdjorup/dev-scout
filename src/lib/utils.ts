import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

interface GreptileRepository {
  remote: string,
  branch: string,
  repository: string,
}

// not complete
interface GreptileSearchBody {
  query: string,
  repositories: GreptileRepository[],
}

interface GreptileSearchResponse {
  repository: string,
  remote: string,
  branch: string,
  filepath: string,
  linestart: number,
  lineend: number,
  summary: string,
}


export const searchRepoGreptile = async (req: GreptileSearchBody): Promise<GreptileSearchResponse[]> => {

  const options: any = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GREPTILE_API_KEY}`,
      'X-GitHub-Token': process.env.GITHUB_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(req),
  }

  return await fetch('https://api.greptile.com/v2/search', options).then(response => response.json()) // ts-ignore
}