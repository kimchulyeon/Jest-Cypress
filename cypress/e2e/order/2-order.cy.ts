describe("주문을 테스트", () => {
  it("사용자는 배달/포장 중 원하는 유형을 선택할 수 있다.", () => {
    cy.visit("/");

    cy.get("[data-cy=deliveryBtn]").should("be.visible").as("deliveryBtn");
    cy.get("[data-cy=pickupBtn]").should("be.visible").as("pickupBtn");

    cy.get("@deliveryBtn").click();
    cy.url().should("include", "/food-type");
  });

  it("사용자는 음식 종류를 선택할 수 있다.", () => {
    cy.visit("/food-type");

    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type",
      },
      [
        {
          id: 1,
          name: "한식",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-hotpot.png",
        },
        {
          id: 2,
          name: "일식",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-hotpot.png",
        },
        {
          id: 3,
          name: "중식",
          icon: "https://kr.object.ncloudstorage.com/icons/ic-hotpot.png",
        },
      ]
    );

    cy.get("[data-cy=1]").should("be.visible").as("koreanFood");
    cy.get("@koreanFood").click();
    cy.url().should("include", "/food-type/1");
  });

  it("사용자는 원하는 레스토랑을 선택할 수 있다.", () => {
    cy.visit("food-type/1");

    cy.intercept(
      {
        method: "GET",
        url: "/restaurant/food-type/1",
      },
      { fixture: "restaurant-list.json" }
    );
  });
});
