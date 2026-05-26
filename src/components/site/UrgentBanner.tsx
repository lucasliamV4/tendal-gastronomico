import { useUrgentBanner } from "@/hooks/useSupabaseQueries";

const UrgentBanner = () => {
  const { data: banner } = useUrgentBanner();
  if (!banner?.active || !banner.text) return null;

  const content = (
    <div className="container mx-auto px-4 py-2 text-center text-sm font-medium">{banner.text}</div>
  );

  return (
    <div className="bg-primary text-primary-foreground">
      {banner.link_url ? (
        <a
          href={banner.link_url}
          target="_blank"
          rel="noopener noreferrer"
          className="block hover:underline"
        >
          {content}
        </a>
      ) : (
        content
      )}
    </div>
  );
};

export default UrgentBanner;
