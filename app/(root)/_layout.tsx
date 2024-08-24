import { Stack } from 'expo-router';

const Layout = () => {
  return (
    <Stack>
      {/* headerShown hide the root on the screen */}
      <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
