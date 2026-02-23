import { useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Provider } from "@supabase/supabase-js";

interface OAuthSignInOptions {
  provider: Provider;
}

export const useOAuthSignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithOAuth = useCallback(async (options: OAuthSignInOptions) => {
    setLoading(true);
    setError(null);

    try {
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: options.provider,
        options: {
          redirectTo: redirectUrl,
          skipBrowserWarning: false,
        },
      });

      if (oauthError) {
        throw oauthError;
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An error occurred during OAuth";
      setError(message);
      console.error(`OAuth error (${options.provider}):`, err);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    signInWithOAuth,
    loading,
    error,
  };
};
