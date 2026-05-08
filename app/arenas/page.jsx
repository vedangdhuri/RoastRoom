"use client";

import { useEffect, useState } from "react";
import { useArenaStore } from "../store/arenaStore";
import { useAuthStore } from "../store/authStore";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import toast from "react-hot-toast";

export default function ArenasPage() {
  const { user } = useAuthStore();
  const { arenas, loading, error, fetchArenas, createArena, deleteArena } =
    useArenaStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newArenaName, setNewArenaName] = useState("");
  const [newArenaDesc, setNewArenaDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchArenas();
  }, [fetchArenas]);

  const handleCreateArena = async (e) => {
    e.preventDefault();
    if (!newArenaName.trim()) return toast.error("Arena name is required");

    setSubmitting(true);
    try {
      await createArena(newArenaName.trim(), newArenaDesc.trim());
      toast.success("Arena created successfully!");
      setIsModalOpen(false);
      setNewArenaName("");
      setNewArenaDesc("");
    } catch (err) {
      toast.error(err.message || "Failed to create arena");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteArena = async (id) => {
    if (!confirm("Are you sure you want to delete this arena?")) return;
    setDeletingId(id);
    try {
      await deleteArena(id);
      toast.success("Arena deleted");
    } catch (err) {
      toast.error(err.message || "Failed to delete arena");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-bold text-white mb-2">
              Battle <span className="text-brand-400">Arenas</span>
            </h1>
            <p className="text-gray-400">
              Create or join arenas — dedicated battlegrounds for roasts &amp;
              debates.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="btn-primary">
            + New Arena
          </Button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
            Error loading arenas: {error}
          </div>
        )}

        {loading && arenas.length === 0 ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : arenas.length === 0 ? (
          <div className="text-center py-20 card ghost-border">
            <h3 className="text-xl font-display text-white mb-2">
              No Arenas Yet
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              Be the first to forge a new battleground. Create an arena and
              claim your territory!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {arenas.map((arena) => {
              const isOwner = user?.id === arena.created_by;

              return (
                <div
                  key={arena.id}
                  className="card-elevated flex flex-col justify-between group h-full"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-lg">🏟️</span>
                      <h3 className="font-display font-bold text-xl text-white">
                        {arena.name}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                      {arena.description || "No description provided."}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-white/[0.04] mt-auto">
                    <span className="text-xs text-gray-600 font-mono">
                      {new Date(arena.created_at).toLocaleDateString()}
                    </span>
                    {isOwner && (
                      <button
                        onClick={() => handleDeleteArena(arena.id)}
                        disabled={deletingId === arena.id}
                        className="text-xs font-semibold text-red-500/70 hover:text-red-400 disabled:opacity-50 transition-colors bg-red-500/10 hover:bg-red-500/20 px-3 py-1.5 rounded-lg"
                      >
                        {deletingId === arena.id ? "Deleting..." : "Delete"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Create New Arena"
        >
          <form onSubmit={handleCreateArena} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Arena Name
              </label>
              <Input
                placeholder="e.g., Code Colosseum"
                value={newArenaName}
                onChange={(e) => setNewArenaName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Description (Optional)
              </label>
              <Input
                placeholder="What battles will be fought here?"
                value={newArenaDesc}
                onChange={(e) => setNewArenaDesc(e.target.value)}
                multiline
                rows={3}
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                onClick={() => setIsModalOpen(false)}
                variant="ghost"
                className="btn-ghost"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                isLoading={submitting}
                className="btn-primary"
              >
                Create Arena
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </ProtectedRoute>
  );
}
