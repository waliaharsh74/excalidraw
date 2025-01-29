
"use client"
import Image, { type ImageProps } from "next/image";
import axios from "axios";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { useState } from "react";



export default function Home() {
  const [room, setRoom] = useState(null);
  const [slug, setSlug] = useState('');
  const handleJoin = () => {
    const roomId =
      alert(`the slug is ${slug}`)
  }

  return (
    <div className={styles.page}>
      <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <Button className="bg-red" fn={handleJoin}>Join</Button>


    </div>
  );
}
