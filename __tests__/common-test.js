var common = require("../common");

describe("parse", function() {
  var sampleJSON = JSON.stringify({
    data: {
      type: "products",
      id: "1",
      attributes: {
        "title": "Awesome product 1"
      },
      relationships: {
        creator: {
          data: {
            id: "1",
            type: "users"
          }
        },
        tags: {
          data: [
            {
              id: "1",
              type: "tags"
            }
          ]
        },
        comments: {
          data: [
            {
              id: "1",
              type: "comments"
            }
          ]
        }
      }
    },
    included: [
      {
        type: "users",
        id: "1",
        attributes: {
          name: "example user 1"
        }
      },
      {
        type: "tags",
        id: "1",
        attributes: {
          name: "example tag 1"
        }
      },
      {
        type: "comments",
        id: "1",
        attributes: {
          body: "example comment 1"
        }
      }
    ]
  });

  it("should parse json-api format json", function() {
    var result = common.parse(sampleJSON);
    expect(result["data"]["creator"]).toEqual({
      type: "users",
      id: "1",
      attributes: {
        name: "example user 1"
      },
      name: "example user 1"
    });
    expect(result["data"]["tags"]).toEqual([{
      type: "tags",
      id: "1",
      attributes: {
        name: "example tag 1"
      },
      name: "example tag 1"
    }]);
    expect(result["data"]["comments"]).toEqual([{
      type: "comments",
      id: "1",
      attributes: {
        body: "example comment 1"
      },
      body: "example comment 1"
    }]);
  });
});
