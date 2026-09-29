import React from "react";
"use client";
import { X, Save, Edit3, Image } from 'lucide-react';
import { type CalendarEvent } from '../App';

interface ReviewModalProps {
  draftEvents: CalendarEvent[];
  setDraftEvents: (events: CalendarEvent[]) => void;
  onApprove: () => void;
  onCancel: () => void;
}

export const ReviewModal = ({
  draftEvents,
  setDraftEvents,
  onApprove,
  onCancel
}: ReviewModalProps) => {
  if (draftEvents.length === 0) return null;

  const handleContentChange = (id: string, newContent: string) => {
    setDraftEvents(
      draftEvents.map(event =>
        event.id === id ? { ...event, content: newContent } : event
      )
    );
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content review-modal">
        <div className="modal-header">
          <h2>Review AI Generated Drafts</h2>
          <button className="btn-close" onClick={onCancel}>
            <X size={20} />
          </button>
        </div>
        <div className="review-body">
          <p className="review-subtitle">
            The AI has generated <strong>{draftEvents.length}</strong> posts based on your strategy. Review and edit the copy below before adding them to your calendar.
          </p>

          <div className="draft-list">
            {draftEvents.map((draft) => (
              <div key={draft.id} className="draft-card">
                <div className="draft-header">
                  <div className={`draft-badge ${draft.type}`}>
                    {draft.type.toUpperCase()}
                  </div>
                  <div className="draft-date">
                    {draft.month + 1}/{draft.day}/{draft.year} at {draft.time}
                  </div>
                </div>
                <div className="draft-title">
                  <Edit3 size={14} />
                  <span>{draft.title}</span>
                </div>
                <textarea
                  className="draft-content-input"
                  value={draft.content || ''}
                  onChange={(e) => handleContentChange(draft.id, e.target.value)}
                  placeholder="Generated post content will appear here..."
                  rows={4}
                />
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <a href="https://www.canva.com/design" target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8rem', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                    <Image size={14} /> Design with Canva
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-link" onClick={onCancel}>
            Discard Drafts
          </button>
          <button className="btn-primary-gold" onClick={onApprove} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Save size={18} />
            Approve & Schedule
          </button>
        </div>
      </div>
    </div>
  );
};