ALTER TABLE notes
  DROP CONSTRAINT notes_parent_id_fkey,
  ADD CONSTRAINT notes_parent_id_fkey
    FOREIGN KEY (parent_id)
    REFERENCES notes(id)
    ON DELETE CASCADE;

-- ============================================
-- Fix auth.uid() performance in RLS policies
-- Replaces auth.uid() with (select auth.uid())
-- ============================================

-- First, drop existing policies
DROP POLICY IF EXISTS "Select visible notes" ON notes;
DROP POLICY IF EXISTS "Insert own notes" ON notes;
DROP POLICY IF EXISTS "Update own notes" ON notes;
DROP POLICY IF EXISTS "Delete own notes" ON notes;

DROP POLICY IF EXISTS "Select visible reactions" ON reactions;
DROP POLICY IF EXISTS "Manage own reactions" ON reactions;

DROP POLICY IF EXISTS "Manage own profile" ON profiles;

DROP POLICY IF EXISTS "View own follower relationships" ON followers;
DROP POLICY IF EXISTS "Insert follow requests" ON followers;
DROP POLICY IF EXISTS "Update follow requests" ON followers;
DROP POLICY IF EXISTS "Delete follow requests" ON followers;

DROP POLICY IF EXISTS "Manage own verse groups" ON verse_groups;

-- ============================================
-- Recreate optimized policies
-- ============================================

-- Select: own notes or visible follower notes
CREATE POLICY "Select visible notes"
ON notes
FOR SELECT
USING (
  user_id = (select auth.uid())
  OR (
    visibility = 'followers'
    AND EXISTS (
      SELECT 1 FROM followers
      WHERE followers.followee_id = notes.user_id
      AND followers.follower_id = (select auth.uid())
      AND followers.pending = FALSE
    )
  )
);

-- Insert: user can only insert for themselves
CREATE POLICY "Insert own notes"
ON notes
FOR INSERT
WITH CHECK (user_id = (select auth.uid()));

-- Update: user can only update their own notes
CREATE POLICY "Update own notes"
ON notes
FOR UPDATE
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- Delete: user can only delete their own notes
CREATE POLICY "Delete own notes"
ON notes
FOR DELETE
USING (user_id = (select auth.uid()));

-- Select reactions on visible notes
CREATE POLICY "Select visible reactions"
ON reactions
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM notes
    WHERE notes.id = reactions.note_id
    AND (
      notes.user_id = (select auth.uid())
      OR (
        notes.visibility = 'followers'
        AND EXISTS (
          SELECT 1 FROM followers
          WHERE followers.followee_id = notes.user_id
          AND followers.follower_id = (select auth.uid())
          AND followers.pending = FALSE
        )
      )
    )
  )
);

-- Insert/update/delete only by user themselves
CREATE POLICY "Manage own reactions"
ON reactions
FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- Manage own profile
CREATE POLICY "Manage own profile"
ON profiles
FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));

-- View own follower relationships
CREATE POLICY "View own follower relationships"
ON followers
FOR SELECT
USING (
  follower_id = (select auth.uid()) OR followee_id = (select auth.uid())
);

-- Allow inserting rows where the follower_id matches the logged-in user
CREATE POLICY "Insert follow requests"
ON followers
FOR INSERT
WITH CHECK (follower_id = (select auth.uid()));

-- Allow updating rows where the follower_id matches the logged-in user
CREATE POLICY "Update follow requests"
ON followers
FOR UPDATE
USING (follower_id = (select auth.uid()))
WITH CHECK (follower_id = (select auth.uid()));

-- Allow deleting rows where the follower_id matches the logged-in user
CREATE POLICY "Delete follow requests"
ON followers
FOR DELETE
USING (follower_id = (select auth.uid()));

-- Manage own verse groups
CREATE POLICY "Manage own verse groups"
ON verse_groups
FOR ALL
USING (user_id = (select auth.uid()))
WITH CHECK (user_id = (select auth.uid()));
