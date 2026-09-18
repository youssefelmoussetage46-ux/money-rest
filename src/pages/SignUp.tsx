import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { FormInput } from '../components/FormInput';
import { Button } from '../components/Button';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const authStore = useAuthStore();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Basic validation
    if (!email) {
      setError('Please enter your email');
      setLoading(false);
      return;
    }

    if (!password) {
      setError('Please enter a password');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    const { error: authError } = await authStore.signUp(email, password);

    if (authError) {
      setError(authError.message ?? 'Unknown error');
      setLoading(false);
    } else {
      // Sign up successful, redirect to dashboard (user will need to verify email)
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-primary-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
          <p className="text-gray-600">
            Join Money Reset to take control of your finances
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
              Email
            </label>
            <FormInput
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              error={!!error && !email ? 'Please enter your email' : undefined}
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>
            <FormInput
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              required
              error={!!error && !password ? 'Please enter your password' : undefined}
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <FormInput
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              required
              error={!!error && password !== confirmPassword ? 'Passwords must match' : undefined}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full">
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Already have an account?{' '}
            <a href="/login" className="text-primary-600 hover:text-primary-700 underline">
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;