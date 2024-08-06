"use client";

import { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define your themes
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#D64933',
    },
    secondary: {
      main: '#92DCE5',
    },
    background: {
      default: '#EEE5E9',
      paper: '#ffffff',
    },
    text: {
      primary: '#D64933',
      secondary: '#D64933',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#AA3422',
    },
    secondary: {
      main: '#248794',
    },
    background: {
      default: '#303030',
      paper: '#424242',
    },
    text: {
      primary: '#ffffff',
      secondary: '#b0bec5',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
  },
});

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'HELLO FRIEND, Tell me some traits about the person you are trying to find a compliment for?' }
  ]);

  const [inputValue, setInputValue] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // Save and load theme preference from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Choose the theme based on darkMode state
  const theme = darkMode ? darkTheme : lightTheme;

  const handleSend = () => {
    if (inputValue.trim()) {
      const userMessage = { role: 'user', content: inputValue };
      setMessages([...messages, userMessage]);
      sendMessage(userMessage);
      setInputValue(""); // Clear input field after sending
    }
  };

  const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: [...messages, message] }),
      });

      const data = await response.json();
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: data.choices[0]?.message?.content || 'No response' }
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        sx={{
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        }}
      >
        <Box display="flex" justifyContent="flex-end" p={2}>
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            color="primary"
          />
          <span style={{ marginLeft: 8 }}>Night Mode</span>
        </Box>

        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          border={`1px solid ${theme.palette.divider}`}
          borderRadius={2}
          p={2}
          maxWidth="600px"
          mx="auto"
          height="calc(100vh - 80px)"
          sx={{
            overflowY: 'auto',
            backgroundColor: theme.palette.background.paper,
          }}
        >
          <Stack direction="column" spacing={2} mb={2}>
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={message.role === 'assistant' ? 'flex-start' : 'flex-end'}
              >
                <Box
                  bgcolor={message.role === 'assistant' ? 'primary.main' : 'secondary.main'}
                  color="white"
                  borderRadius={16}
                  p={2}
                  maxWidth="80%"
                  sx={{
                    wordBreak: 'break-word',
                    '@media (max-width: 600px)': {
                      maxWidth: '90%',
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Message"
              fullWidth
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button variant="contained" onClick={handleSend}>
              Send
            </Button>
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
