const mongoose = require("mongoose");
const { expect } = require("chai");
const Item = require("../models/Item.model");
const config = require('../../config');

describe("Item Model Test", function () {
  // Increase the timeout for the entire suite
  this.timeout(20000);

  before(async () => {
    try {
      await mongoose.connect(config.mongodbUri);
      console.log("We are connected to the test database!");
    } catch (error) {
      console.error("Connection error:", error);
    }
  });

  after(async () => {
    try {
      await mongoose.connection.db.dropDatabase();
      await mongoose.disconnect();
    } catch (error) {
      console.error("Disconnection error:", error);
    }
  });

  it("should be invalid if required fields are missing", async () => {
    const item = new Item();

    try {
      await item.validate();
    } catch (err) {
      expect(err.errors.name).to.exist;
      expect(err.errors.description).to.exist;
    }
  });

  it("should create an item successfully with correct parameters", async () => {
    const validItem = {
      name: "Valid Item",
      description: "Description of test item",
    };

    try {
      const item = await Item.create(validItem);
      expect(item).to.have.property("name", validItem.name);
      expect(item).to.have.property("description", validItem.description);
      expect(item).to.have.property("createdAt").that.is.a("date");
    } catch (err) {
      expect.fail("Item creation failed");
    }
  });

  it("should set createdAt to the current date if not provided", async () => {
    const validItem = {
      name: "Valid Item",
      description: "Description of test item",
    };

    const item = await Item.create(validItem);
    expect(item.createdAt).to.exist;
    expect(new Date(item.createdAt)).to.be.a("date");
  });

  it("should be invalid if name is not a string", async () => {
    const item = new Item({ name: 123, description: "Description" });

    try {
      await item.validate();
    } catch (err) {
      expect(err.errors.name).to.exist;
    }
  });

  it("should be invalid if description is not a string", async () => {
    const item = new Item({ name: "Name", description: 123 });

    try {
      await item.validate();
    } catch (err) {
      expect(err.errors.description).to.exist;
    }
  });

  it("should be invalid if name is an empty string", async () => {
    const item = new Item({ name: "", description: "Description" });

    try {
      await item.validate();
    } catch (err) {
      expect(err.errors.name).to.exist;
    }
  });

  it("should be invalid if description is an empty string", async () => {
    const item = new Item({ name: "Name", description: "" });

    try {
      await item.validate();
    } catch (err) {
      expect(err.errors.description).to.exist;
    }
  });
});
