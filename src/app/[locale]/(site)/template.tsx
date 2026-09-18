/**
 * A short cross-fade between pages. Templates remount on navigation, layouts do not,
 * so the CSS animation restarts by itself. Deliberately not a motion component: the
 * server cannot know the reader's motion preference, and guessing it caused a
 * hydration mismatch. The media query in globals.css handles reduced motion.
 */
export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="animate-page-fade">{children}</div>;
}
