import AdminClient from './AdminClient';

export const metadata = {
  title: 'Admin | ohmysales',
  description: 'Admin dashboard for ohmysales',
  robots: 'noindex, nofollow', // Don't index admin pages
};

export default function AdminPage() {
  return <AdminClient />;
}
