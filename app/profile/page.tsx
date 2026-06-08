import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export default function Page() {
  return (
    <div className="w-full min-h-screen px-4 py-8 flex flex-col items-center gap-6">
      <h1 className="text-3xl font-bold tracking-tight text-green-400">
        User Profile
      </h1>

      {/* Profile Overview */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your basic profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-500 text-sm">
                Photo
              </div>
              <div>
                <Button disabled variant="outline" size="sm">
                  Edit Profile
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Full Name</FieldLabel>
                <Input disabled value="Juan Dela Cruz" />
              </Field>
              <Field>
                <FieldLabel>Username or ID</FieldLabel>
                <Input disabled value="juandc_123" />
              </Field>
              <Field>
                <FieldLabel>Email address</FieldLabel>
                <Input disabled value="juan@example.com" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Personal Info */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Personal Info</CardTitle>
          <CardDescription>Your personal details.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Phone number</FieldLabel>
                <Input disabled value="+63 912 345 6789" />
              </Field>
              <Field>
                <FieldLabel>Date of birth</FieldLabel>
                <Input disabled value="01/01/1990" />
              </Field>
              <Field>
                <FieldLabel>Gender</FieldLabel>
                <Input disabled value="Male" />
              </Field>
              <Field>
                <FieldLabel>Address / Location</FieldLabel>
                <Input
                  disabled
                  value="123 Main St, Metro Manila, Philippines"
                />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Account & Security */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Account & Security</CardTitle>
          <CardDescription>Manage your security settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input disabled type="password" value="********" />
              </Field>
              <Field>
                <FieldLabel>Two-factor authentication (2FA)</FieldLabel>
                <Input disabled value="Enabled (SMS)" />
              </Field>
              <Field>
                <FieldLabel>Connected accounts</FieldLabel>
                <Input disabled value="Google linked" />
              </Field>
              <Field>
                <FieldLabel>Active sessions / devices</FieldLabel>
                <Input disabled value="1 Active Session (Windows PC)" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Activity / Status */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Activity & Status</CardTitle>
          <CardDescription>
            Your account activity and verification status.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Account status</FieldLabel>
                <Input disabled value="Active & Verified" />
              </Field>
              <Field>
                <FieldLabel>Member since</FieldLabel>
                <Input disabled value="August 2023" />
              </Field>
              <Field>
                <FieldLabel>Last login</FieldLabel>
                <Input disabled value="Today at 10:30 AM" />
              </Field>
              <Field>
                <FieldLabel>Verification badge</FieldLabel>
                <Input disabled value="Fully Verified" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      {/* Preferences */}
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>App settings and notifications.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field>
                <FieldLabel>Notification preferences</FieldLabel>
                <Input disabled value="Email & SMS Enabled" />
              </Field>
              <Field>
                <FieldLabel>Language / timezone</FieldLabel>
                <Input disabled value="English (US) / UTC+8" />
              </Field>
              <Field>
                <FieldLabel>Privacy settings</FieldLabel>
                <Input disabled value="Standard" />
              </Field>
            </div>
          </FieldGroup>
        </CardContent>
      </Card>

      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-red-500">Account Actions</CardTitle>
          <CardDescription>Log out or delete your account.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Button disabled variant="outline">
            Logout
          </Button>
          <Button disabled variant="destructive">
            Deactivate / Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
