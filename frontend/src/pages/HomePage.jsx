import React, { useEffect } from "react";
import { useState } from "react";
import api from "../lib/axios.js";
import toast, { LoaderIcon } from "react-hot-toast";

import Navbar from "../components/Navbar.jsx";
import RateLimitedUI from "../components/RateLimitedUI.jsx";
import NoteCard from "../components/NoteCard.jsx";
import NotesNotFound from "../components/NotesNotFound.jsx";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await api.get("/notes");
        console.log(res);
        setNotes(res.data);
        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);
        if (error.response && error.response.status === 429) {
          setIsRateLimited(true);
        } else {
          setIsRateLimited(false);
          toast.error("Failed to load notes");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  return (
    <div className="min-h-screen bg-primary-content">
      <Navbar />
      {isRateLimited && <RateLimitedUI />}
      <div className="max-w-7xl mx-auto p-4 mt-6">
        {loading && (
          <div className="min-h-screen bg-base-200 flex items-center justify-center">
            <LoaderIcon className="animate-spin size-10" />
          </div>
        )}

        {notes.length === 0 && !isRateLimited && <NotesNotFound />}

        {notes.length > 0 && !isRateLimited && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note._id} note={note} setNotes={setNotes} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
