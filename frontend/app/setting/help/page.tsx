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

const Help = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Help</CardTitle>
        <CardDescription>Get assistance and support for using our app.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>If you need help, please check our FAQ or contact our support team.</p>
        <ul className="list-disc pl-5 mt-2">
          <li>How do I create a new bookmark?</li>
          <li>Can I organize my bookmarks into folders?</li>
          <li>How do I share my bookmarks with others?</li>
          <li>Is there a limit to how many bookmarks I can save?</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Contact Support</Button>
      </CardFooter>
    </Card>
  )
}

export default Help