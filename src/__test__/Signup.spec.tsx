import "@testing-library/jest-dom";

import { fireEvent, render, screen } from "@testing-library/react";
import SignupPage from "../pages/SignupPage";
import { RouterProvider, createMemoryRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {},
});

describe("회원가입 테스트", () => {
  // given - 회원가입 페이지가 그려짐 (📌 beforeEach)
  beforeEach(() => {
    const routes = [
      {
        path: "/signup",
        element: <SignupPage />,
      },
    ];

    const router = createMemoryRouter(routes, {
      initialEntries: ["/signup"],
      initialIndex: 0,
    });

    render(
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    );
  });

  // TEST #1
  test("비밀번호와 비밀번호 확인 값이 일치하지 않으면 에러메세지가 표시된다", async () => {
    // when - 비밀번호와 비밀번호 확인 값이 일치하지 않음
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");

    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, {
      target: { value: "wrongPassword" },
    });

    // then - 에러메세지가 표시됨
    const errorMessage = await screen.findByTestId("error-message");
    expect(errorMessage).toBeInTheDocument();
  });

  // TEST #2
  test("이메일을 입력하고, 비밀번호와 비밀번호 확인값이 일치하면 회원가입 버튼이 활성화된다.", () => {
    // given - 회원가입 페이지가 그려짐 (beforeEach)

    // when - 이메일 입력, 비밀번호 비밀번호확인 입력값 일치
    const emailInput = screen.getByLabelText("이메일");
    const passwordInput = screen.getByLabelText("비밀번호");
    const confirmPasswordInput = screen.getByLabelText("비밀번호 확인");
    const signupButton = screen.getByRole("button", { name: "회원가입" });

    expect(signupButton).toBeDisabled();

    fireEvent.change(emailInput, { target: { value: "test-email" } });
    fireEvent.change(passwordInput, { target: { value: "password" } });
    fireEvent.change(confirmPasswordInput, { target: { value: "password" } });

    // then - 회원가입 버튼이 활성화됨
    expect(signupButton).toBeEnabled();
  });
});
