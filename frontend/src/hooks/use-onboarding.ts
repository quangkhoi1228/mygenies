import { useMemo, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onboardingActions } from "@/redux/features/onboarding.slice";
import { RootState } from "@/redux/store";

export default function useOnboarding() {
  const dispatch = useDispatch();
  const onboardingState = useSelector((state: RootState) => state.onboardingState);
  const [redirect, setRedirect] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const redirectCache = useMemo(() => redirect, [redirect]);
  const loadingCache = useMemo(() => loading, [loading]);

  useEffect(() => {
    dispatch(onboardingActions.getStatusOnboarding());
    if (onboardingState.done) {
      setRedirect(false);
    }
  }, [dispatch, onboardingState.done]);
  useEffect(() => {
    if (!onboardingState.done && onboardingState.done !== null) {
      setRedirect(true);
    }
  }, [onboardingState.done]);
  useEffect(() => {
    if (!onboardingState.loading) {
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }
    return () => {};
  }, [onboardingState.loading]);
  return { redirect: redirectCache, loading: loadingCache };
}
