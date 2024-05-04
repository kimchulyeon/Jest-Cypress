describe("로그인 화면", () => {
  it("사용자는 아이디와 비밀번호를 사용해서 로그인한다.", () => {
    // given - 로그인 페이지에 접근한다
    cy.visit("/login");
    cy.get("[data-cy=emailInput]").as("emailInput");
    cy.get("[data-cy=passwordInput]").as("passwordInput");
    cy.get("[data-cy=loginButton]").as("loginButton");

    // when - 아이디와 비밀번호를 입력하고 로그인 버튼을 클릭한다
    cy.get("@emailInput").type("test@email.com");
    cy.get("@passwordInput").type("password");

    cy.get("@emailInput").invoke("val").should("equal", "test@email.com");
    cy.get("@passwordInput").invoke("val").should("equal", "password");

    //  실제 API 호출을 가로채서 응답을 제어한다.
    cy.intercept(
      {
        method: "POST",
        url: "/user/login",
      },
      {
        token: "FAKE_API_REQUEST_TOKEN",
      }
    ).as("login");

    //  실제로 API를 호출한다. (위에 intercept로 가로채기)
    cy.get("@loginButton").should("exist").click();
    cy.wait("@login");

    // then - 로그인에 성공하고 메인페이지로 이동
    cy.url().should("equal", "http://localhost:5173/");
  });
});
