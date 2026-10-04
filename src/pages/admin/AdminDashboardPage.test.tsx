import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import AdminDashboardPage from "./AdminDashboardPage";

const { storageFromMock, storageFromFn, authMock } = vi.hoisted(() => {
  const storageFromMock = {
    getPublicUrl: vi.fn(),
    upload: vi.fn(),
    list: vi.fn(),
    remove: vi.fn(),
  };
  return {
    storageFromMock,
    storageFromFn: vi.fn(() => storageFromMock),
    authMock: { signOut: vi.fn() },
  };
});

vi.mock("../../lib/supabase", () => ({
  SITE_IMAGES_BUCKET: "site-images",
  OWNER_PHOTO_PATH: "owner/photo.jpg",
  CONNECT_BUILDERS_PREFIX: "connect-builders",
  supabase: {
    auth: authMock,
    storage: { from: storageFromFn },
  },
}));

beforeEach(() => {
  vi.resetAllMocks();
  storageFromFn.mockImplementation(() => storageFromMock);
  storageFromMock.getPublicUrl.mockImplementation((path: string) => ({
    data: { publicUrl: `https://fake.test/${path}` },
  }));
});

function renderDashboard() {
  render(
    <MemoryRouter initialEntries={["/admin"]}>
      <Routes>
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/login" element={<div>Admin Login Page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminDashboardPage", () => {
  it("renders the current owner photo and uploads a replacement", async () => {
    storageFromMock.list.mockResolvedValue({ data: [] });
    storageFromMock.upload.mockResolvedValue({ error: null });

    const user = userEvent.setup();
    renderDashboard();

    expect(screen.getByAltText("Current owner photo")).toHaveAttribute(
      "src",
      "https://fake.test/owner/photo.jpg?v=0"
    );

    const file = new File(["photo"], "owner.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText(/replace photo/i), file);

    await waitFor(() =>
      expect(storageFromMock.upload).toHaveBeenCalledWith("owner/photo.jpg", file, {
        upsert: true,
      })
    );
    await waitFor(() =>
      expect(screen.getByAltText("Current owner photo")).toHaveAttribute(
        "src",
        "https://fake.test/owner/photo.jpg?v=1"
      )
    );
  });

  it("lists the Connect Builders gallery and deletes an image", async () => {
    storageFromMock.list.mockResolvedValueOnce({
      data: [{ name: "photo1.jpg" }, { name: "photo2.jpg" }],
    });
    storageFromMock.remove.mockResolvedValue({ error: null });
    storageFromMock.list.mockResolvedValueOnce({ data: [{ name: "photo2.jpg" }] });

    const user = userEvent.setup();
    renderDashboard();

    expect(await screen.findByAltText("photo1.jpg")).toBeInTheDocument();
    expect(screen.getByAltText("photo2.jpg")).toBeInTheDocument();

    await user.click(screen.getAllByRole("button", { name: /delete/i })[0]);

    expect(storageFromMock.remove).toHaveBeenCalledWith(["connect-builders/photo1.jpg"]);
    await waitFor(() => expect(screen.queryByAltText("photo1.jpg")).not.toBeInTheDocument());
    expect(screen.getByAltText("photo2.jpg")).toBeInTheDocument();
  });

  it("uploads a new image to the Connect Builders gallery", async () => {
    storageFromMock.list.mockResolvedValueOnce({ data: [] });
    storageFromMock.upload.mockResolvedValue({ error: null });
    storageFromMock.list.mockResolvedValueOnce({ data: [{ name: "new-photo.jpg" }] });

    const user = userEvent.setup();
    renderDashboard();

    expect(await screen.findByText(/no images yet/i)).toBeInTheDocument();

    const file = new File(["photo"], "new-photo.jpg", { type: "image/jpeg" });
    await user.upload(screen.getByLabelText(/add a new image/i), file);

    await waitFor(() => expect(storageFromMock.upload).toHaveBeenCalled());
    const [uploadedPath] = storageFromMock.upload.mock.calls[0];
    expect(uploadedPath).toMatch(/^connect-builders\/\d+-new-photo\.jpg$/);

    expect(await screen.findByAltText("new-photo.jpg")).toBeInTheDocument();
  });

  it("signs out and navigates to the admin login page on logout", async () => {
    storageFromMock.list.mockResolvedValue({ data: [] });
    authMock.signOut.mockResolvedValue({ error: null });

    const user = userEvent.setup();
    renderDashboard();

    await user.click(screen.getByRole("button", { name: /log out/i }));

    expect(authMock.signOut).toHaveBeenCalled();
    expect(await screen.findByText("Admin Login Page")).toBeInTheDocument();
  });
});
