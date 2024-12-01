"use client"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const About = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About</CardTitle>
        <CardDescription>Learn more about our app and its features.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Our bookmark management app is designed to help you organize, access, and share your favorite web content efficiently and effectively.</p>
        <h3 className="font-semibold mt-4 mb-2">Key Features:</h3>
        <ul className="list-disc pl-5">
          <li>Easy bookmark organization with folders and tags</li>
          <li>Quick search and filter options</li>
          <li>Sync across multiple devices</li>
          <li>Secure and private bookmark storage</li>
          <li>Regular updates and new features</li>
          <li>Customizable bookmark views</li>
          <li>Browser extension for quick saving</li>
          <li>Collaboration features for team bookmarking</li>
        </ul>
        <h3 className="font-semibold mt-4 mb-2">Our Services:</h3>
        <ul className="list-disc pl-5">
          <li>Free tier with basic features</li>
          <li>Premium tier with advanced organization and sharing options</li>
          <li>24/7 customer support</li>
          <li>Regular feature updates based on user feedback</li>
          <li>Data backup and recovery options</li>
          <li>API access for developers</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Check for Updates</Button>
      </CardFooter>
    </Card>
  )
}

export default About