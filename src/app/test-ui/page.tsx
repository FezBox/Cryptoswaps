"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Input from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { Skeleton } from "@/components/ui/skeleton";

export default function TestUIPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-12 py-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-text-primary">
          SODAX UI Component Library
        </h1>
        <p className="text-lg text-text-secondary">
          Comprehensive showcase of all UI components
        </p>
      </div>

      {/* Button Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Buttons</h2>
          <p className="text-text-secondary">
            Various button styles and states
          </p>
        </div>

        {/* Variants */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Accent</Button>
            </div>
          </CardContent>
        </Card>

        {/* Sizes */}
        <Card>
          <CardHeader>
            <CardTitle>Button Sizes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading States */}
        <Card>
          <CardHeader>
            <CardTitle>Loading States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button loading variant="primary">
                Loading
              </Button>
              <Button loading variant="secondary">
                Loading
              </Button>
              <Button loading variant="outline">
                Loading
              </Button>
              <Button loading variant="accent">
                Loading
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Disabled States */}
        <Card>
          <CardHeader>
            <CardTitle>Disabled States</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button disabled variant="primary">
                Disabled
              </Button>
              <Button disabled variant="secondary">
                Disabled
              </Button>
              <Button disabled variant="outline">
                Disabled
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Input Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Inputs</h2>
          <p className="text-text-secondary">Form input components</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Input Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input placeholder="Basic input without label" />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
            />

            <Input
              label="Input with Error (Boolean)"
              error
              placeholder="This field has an error"
            />

            <Input
              label="Username"
              error="This username is already taken"
              defaultValue="taken_username"
            />

            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
            />

            <Input
              label="Disabled Input"
              disabled
              defaultValue="Cannot edit this"
            />
          </CardContent>
        </Card>
      </section>

      {/* Card Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Cards</h2>
          <p className="text-text-secondary">Content containers</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-text-secondary">
                This is a basic card with header and content. Cards use the
                SODAX cream border and soft shadow.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Action</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-text-secondary">
                Cards can contain any content including buttons and other
                components.
              </p>
              <Button variant="primary" size="sm">
                Take Action
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Input</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input label="Enter Amount" type="number" placeholder="0.00" />
              <Button variant="accent" size="sm">
                Submit
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics Card</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">Total Volume</span>
                  <span className="font-semibold text-text-primary">
                    $1,234,567
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">24h Change</span>
                  <span className="font-semibold text-accent">+12.5%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Modal Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">Modal</h2>
          <p className="text-text-secondary">Dialog overlay components</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Modal Examples</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-text-secondary text-sm mb-2">
                Simple modal with text content
              </p>
              <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
            </div>
            <div>
              <p className="text-text-secondary text-sm mb-2">
                Modal with form content
              </p>
              <Button variant="secondary" onClick={() => setFormModalOpen(true)}>
                Open Form Modal
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Simple Modal */}
        <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Modal Title
          </h3>
          <p className="text-text-secondary mb-6">
            This is a modal dialog. You can close it by clicking outside, pressing
            ESC, or clicking the Cancel button below.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>

        {/* Form Modal */}
        <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)}>
          <h3 className="text-xl font-semibold text-text-primary mb-4">
            Enter Details
          </h3>
          <div className="space-y-4 mb-6">
            <Input label="Email" type="email" placeholder="your@email.com" />
            <Input
              label="Amount"
              type="number"
              placeholder="0.00"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="ghost" onClick={() => setFormModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="accent" onClick={() => setFormModalOpen(false)}>
              Submit
            </Button>
          </div>
        </Modal>
      </section>

      {/* Skeleton Section */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Skeletons
          </h2>
          <p className="text-text-secondary">Loading state placeholders</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Skeleton Variants</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Text Skeletons */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary mb-2">
                Text Lines
              </p>
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            {/* Title Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary mb-2">
                Title
              </p>
              <Skeleton className="h-8 w-1/3" />
            </div>

            {/* Card Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary mb-2">
                Card Skeleton
              </p>
              <Skeleton className="h-24 w-full" />
            </div>

            {/* Avatar with Text */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary mb-2">
                Avatar with Text
              </p>
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            </div>

            {/* List Skeleton */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-text-primary mb-2">
                List Items
              </p>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Combined Example */}
      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-text-primary">
            Combined Example
          </h2>
          <p className="text-text-secondary">
            Components working together
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Swap Preview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              label="You Send"
              type="number"
              placeholder="0.00"
            />
            <div className="flex justify-center">
              <Button variant="ghost" size="sm">
                ↓
              </Button>
            </div>
            <Input
              label="You Receive"
              type="number"
              placeholder="0.00"
            />
            <Button variant="primary" className="w-full">
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
