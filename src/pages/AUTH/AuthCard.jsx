import React, { useState } from 'react';
import { Card, CardContent, Box, Button, Typography, Divider } from '@mui/material';
import { styled } from '@mui/material/styles';

const FlipCard = styled(Box)({
  perspective: '1000px',
  width: '100%',
  maxWidth: '400px',
  height: '600px',
  position: 'relative',
  margin: 'auto',
});

const FlipCardInner = styled(Box)(({ flipped }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  transition: 'transform 0.6s',
  transformStyle: 'preserve-3d',
  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
}));

const sharedCardStyle = {
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  padding: '1rem',
  boxSizing: 'border-box',
};

const FlipCardFront = styled(Card)(sharedCardStyle);

const FlipCardBack = styled(Card)({
  ...sharedCardStyle,
  transform: 'rotateY(180deg)',
});

const AuthCard = ({ loginComponent, registerComponent, flipped, setFlipped }) => {

  return (
    <FlipCard>
      <FlipCardInner flipped={flipped}>
        <FlipCardFront elevation={4}>
          <CardContent>
            {loginComponent}
            <Box mt={2}>
              <Button 
                fullWidth 
                variant="text" 
                onClick={() => setFlipped(true)}
              >
                Don't have an account? Register
              </Button>
            </Box>
          </CardContent>
        </FlipCardFront>
        <FlipCardBack elevation={4}>
          <CardContent>
            {registerComponent}
            <Divider sx={{ my: 2 }} />
            <Button 
              fullWidth 
              variant="text" 
              onClick={() => setFlipped(false)}
            >
              Already have an account? Login
            </Button>
          </CardContent>
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
  );
};

export default AuthCard;
