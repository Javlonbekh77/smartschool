import { Pencil } from 'lucide-react';

// This is a temporary file to work around an issue with the build process.
// It ensures that the lucide-react icons are included in the final bundle.
// The icons are used in the following files:
// - src/app/(main)/staff/page.tsx
//
// If you are removing all usages of the icons from the above files, you can delete this file.
// We are tracking a bug to fix this issue.
const LucideIcons = () => {
  return (
    <div>
      <Pencil />
    </div>
  );
};
