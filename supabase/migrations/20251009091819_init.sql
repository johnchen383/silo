-- Enums
CREATE TYPE note_type AS ENUM ('text', 'question', 'voice', 'drawing');
CREATE TYPE visibility_type AS ENUM ('private', 'followers');

-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  anchor_start INT NOT NULL,
  anchor_end INT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  type note_type NOT NULL DEFAULT 'text',
  created_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  edited_timestamp TIMESTAMP WITH TIME ZONE,
  parent_id UUID REFERENCES notes(id) ON DELETE SET NULL,
  visibility visibility_type NOT NULL DEFAULT 'private'
);

-- Reactions table
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL, -- could be emoji or string label
  UNIQUE(note_id, user_id) -- one reaction per user per note
);

-- Profiles table
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_history JSONB DEFAULT '[]'::jsonb,
  bookmarked JSONB DEFAULT '{}'::jsonb,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Followers table
CREATE TABLE followers (
  follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  followee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  pending BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (follower_id, followee_id)
);

-- Verse Groups table
CREATE TABLE verse_groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  highlight TEXT, -- could store color or style
  anchors INT[] DEFAULT '{}'
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE verse_groups ENABLE ROW LEVEL SECURITY;

-- Select: own notes or visible follower notes
CREATE POLICY "Select visible notes"
ON notes
FOR SELECT
USING (
  user_id = auth.uid()
  OR (
    visibility = 'followers'
    AND EXISTS (
      SELECT 1 FROM followers
      WHERE followers.followee_id = notes.user_id
      AND followers.follower_id = auth.uid()
      AND followers.pending = FALSE
    )
  )
);

-- Insert: user can only insert for themselves
CREATE POLICY "Insert own notes"
ON notes
FOR INSERT
WITH CHECK (user_id = auth.uid());

-- Update: user can only update their own notes
CREATE POLICY "Update own notes"
ON notes
FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Delete: user can only delete their own notes
CREATE POLICY "Delete own notes"
ON notes
FOR DELETE
USING (user_id = auth.uid());

-- Select reactions on visible notes
CREATE POLICY "Select visible reactions"
ON reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = reactions.note_id
    AND (
      notes.user_id = auth.uid()
      OR notes.visibility = 'followers'
      AND EXISTS (
        SELECT 1 FROM followers
        WHERE followers.followee_id = notes.user_id
        AND followers.follower_id = auth.uid()
        AND followers.pending = FALSE
      )
    )
  )
);

-- Insert/update/delete only by user themselves
CREATE POLICY "Manage own reactions"
ON reactions
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());


CREATE POLICY "Manage own profile"
ON profiles
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "View own follower relationships"
ON followers
FOR SELECT
USING (
  follower_id = auth.uid() OR followee_id = auth.uid()
);

-- Allow inserting rows where the follower_id matches the logged-in user
CREATE POLICY "Insert follow requests"
ON followers
FOR INSERT
WITH CHECK (follower_id = auth.uid());

-- Allow updating rows where the follower_id matches the logged-in user
CREATE POLICY "Update follow requests"
ON followers
FOR UPDATE
USING (follower_id = auth.uid())
WITH CHECK (follower_id = auth.uid());

-- Allow deleting rows where the follower_id matches the logged-in user
CREATE POLICY "Delete follow requests"
ON followers
FOR DELETE
USING (follower_id = auth.uid());

CREATE POLICY "Manage own verse groups"
ON verse_groups
FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
