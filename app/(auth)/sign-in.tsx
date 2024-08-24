import { Link, useRouter } from 'expo-router';
import { Image, ScrollView, Text, View } from 'react-native';
import CustomButton from '../../components/CustomButton';
import InputField from '../../components/InputFIeld';
import OAuth from '../../components/OAuth';
import { images, icons } from '../../constants';
import { useCallback, useState } from 'react';
import { useSignIn } from '@clerk/clerk-expo';

const SignIn = () => {
  const [form, setform] = useState({ email: '', password: '' });
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const onSignInPress = useCallback(async () => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/');
      } else {
        // See https://clerk.com/docs/custom-flows/error-handling
        // for more info on error handling
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [isLoaded, signIn, form.email, form.password, setActive, router]);
  return (
    <ScrollView className='flex-1 bg-white'>
      <View className='flex-1 bg-white'>
        <View className='relative w-full h-[250px]'>
          <Image source={images.signUpCar} className='z-0 w-full h-[250px]' />
          <View className='flex-1 bg-white'>
            <Text className='text-2xl text-black font-JakartaSemiBold absolute bottom-5 left-5'>
              Welcome 🙏🏾
            </Text>
          </View>
        </View>
        <View className='p-5'>
          <InputField
            label='Email'
            placeholder='Enter your email'
            icon={icons.email}
            value={form.email}
            onChangeText={(value: string) => setform({ ...form, email: value })}
          />
          <InputField
            label='Password'
            placeholder='Enter your password'
            secureTextEntry
            icon={icons.lock}
            value={form.password}
            onChangeText={(value: string) =>
              setform({ ...form, password: value })
            }
          />

          <CustomButton
            className='mt-6'
            title='Sign Up'
            onPress={onSignInPress}
          />
          <OAuth />
          <Link
            href='/sign-up'
            className='text-lg text-center text-general-200 mt-10'
          >
            <Text>Don't have an account ? </Text>
            <Text className='text-primary-500'>Sign In</Text>
          </Link>
        </View>
        {/*//*  Modal Verification  */}
      </View>
    </ScrollView>
  );
};

export default SignIn;
