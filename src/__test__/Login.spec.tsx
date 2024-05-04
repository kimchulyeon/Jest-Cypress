import "@testing-library/jest-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
} from "@testing-library/react";
import LoginPage from "../pages/LoginPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import useLogin from "../hooks/useLogin";
import * as nock from "nock";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("로그인 테스트", () => {
  // given
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // console.error 무시

    const routes = [{ path: "/login", element: <LoginPage /> }];
    const router = createMemoryRouter(routes, {
      initialEntries: ["/login"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  test("로그인에 실패하면 에러메시지가 뜬다.", async () => {
    // when
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    nock("http://inflearn.byeongjinkang.com")
      .post("/user/login/", {
        username: "wrong@email.com",
        password: "wrong-password",
      })
      .reply(400, { msg: "NO_SUCH_USER" });

    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const loginButton = screen.getByRole("button", { name: "로그인" });

    fireEvent.change(emailInput, { target: { value: "wrong@email.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrong-password" } });

    fireEvent.click(loginButton);

    const { result } = renderHook(() => useLogin(), { wrapper });
    await waitFor(() => result.current.isError);
    const errMessage = await screen.findByTestId("error-message");
    expect(errMessage).toBeInTheDocument();

    // then
  });
});
