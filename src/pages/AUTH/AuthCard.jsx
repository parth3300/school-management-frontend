import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const FlipCard = styled(Box)(({ dynamicwidth }) => ({
  perspective: '1000px',
  width: '100%',
  maxWidth: dynamicwidth,
  minHeight: '750px',
  height: 'fit-content',
  position: 'relative',
  margin: '2rem auto',
  transition: 'max-width 0.5s ease',
}));

const FlipCardInner = styled(Box)(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
  minHeight: '100%',
}));

const sharedCardStyle = {
  position: 'absolute',
  width: '100%',
  backfaceVisibility: 'hidden',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '2rem 1.5rem',
  minHeight: '750px',
};

const FlipCardFront = styled(Card)(sharedCardStyle);
const FlipCardBack = styled(Card)({
  ...sharedCardStyle,
  transform: 'rotateY(180deg)',
});

const AuthCard = ({
  loginComponent,
  registerComponent,
  flipped,
  setFlipped,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loginRef = useRef(null);
  const registerRef = useRef(null);
  const [dynamicWidth, setDynamicWidth] = useState('450px');

  useEffect(() => {
    const checkFieldCount = (ref) => {
      if (!ref?.current) return 0;
      return ref.current.querySelectorAll('input, select, textarea').length;
    };

    const loginFields = checkFieldCount(loginRef);
    const registerFields = checkFieldCount(registerRef);
    const maxFields = Math.max(loginFields, registerFields);

    if (maxFields > 6) {
      setDynamicWidth('700px'); // Wider for multi-column forms
    } else if (maxFields > 3) {
      setDynamicWidth('550px');
    } else {
      setDynamicWidth('450px');
    }
  }, [loginComponent, registerComponent]);

  return (
    <FlipCard dynamicwidth={isMobile ? '100%' : dynamicWidth}>
      <FlipCardInner flipped={flipped}>
        <FlipCardFront elevation={5}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1 }} ref={loginRef}>
              {loginComponent}
            </Box>
            <Button fullWidth variant="text" onClick={() => setFlipped(true)}>
              Don&apos;t have an account? Register
            </Button>
          </CardContent>
        </FlipCardFront>

        <FlipCardBack elevation={5}>
          <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ flex: 1 }} ref={registerRef}>
              {registerComponent}
            </Box>
            <Divider sx={{ my: 2 }} />
            <Button fullWidth variant="text" onClick={() => setFlipped(false)}>
              Already have an account? Login
            </Button>
          </CardContent>
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
};

export default AuthCard;
