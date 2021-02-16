import Observable from "./Observable";
import { arraysEqual } from "../utility"

class Store extends Observable {
  constructor() {
    super();
    this.state = {
      deals: [],
      productFilters: [],
      providerFilter: null
    };
  }

  get deals() {
    return this.filter();
  }

  formatProductTypes(productTypes) {
    return productTypes.filter((type) => type !== "Phone").map((type) => type.replace("Fibre Broadband", "Broadband").toLowerCase());
  }

  filter() {
    let newDeals = this.state.deals.slice();

    // Filter the deals based on the product filters
    if (this.state.productFilters && this.state.productFilters.length > 0) {
      // Format the product types array to remove Phones/Fibre Broadband and put it to lower case
      // Sort the two string arrays and then compare them to check they're equal
      newDeals = this.state.deals.filter((deal) => arraysEqual(this.formatProductTypes(deal.productTypes).sort(), this.state.productFilters.sort()));
    }
    // Filter the deals based on the product id / provider.id
    if (this.state.providerFilter) {
      newDeals = newDeals.filter((deal) => deal.provider.id === this.state.providerFilter);
    }

    return newDeals;
  }

  setDeals(data) {
    this.state.deals = data;
    this.notify(this.state);
  }

  setProductFilter(value) {
    const filter = value.trim().toLowerCase();
    const index = this.state.productFilters.indexOf(filter);
    if (index === -1) {
      this.state.productFilters.push(filter);
    } else {
      this.state.productFilters.splice(index, 1);
    }
    this.notify(this.state);
  }

  setProviderFilter(value = null) {
    this.state.providerFilter = value;
    this.notify(this.state);
  }
}

export default Store;
