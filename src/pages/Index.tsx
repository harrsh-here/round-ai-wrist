import SmartWatch from "@/components/SmartWatch";

interface IndexProps {
  isLoggedIn: boolean;
  onLogin: (token: string) => void;
  onLogout: () => void;
}

const Index = ({ isLoggedIn, onLogin, onLogout }: IndexProps) => {
  return (
    <div className="min-h-screen bg-background">
      <SmartWatch
        isLoggedIn={isLoggedIn}
        onLogin={onLogin}
        onLogout={onLogout}
      />
    </div>
  );
};

export default Index;
