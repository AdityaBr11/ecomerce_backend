class ApiFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};
    //   console.log(keyword,'keyword')
    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryStr };

    // console.log(queryCopy,"start")
    //rmve the field for category
    const removeFields = ["keyword", "page", "limit"];
    removeFields.forEach((key) => delete queryCopy[key]);

    //filter for price and rating

    // console.log(queryCopy)

    let queryStr = JSON.stringify(queryCopy);
    queryStr =  queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match =>`$${match}`)

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  pagination(resPerpage){
    const currentPage=Number(this.queryStr.page) || 1
    const skip=resPerpage*(currentPage-1);
    this.query=this.query.limit(resPerpage).skip(skip)
    return this;
  }
}
module.exports = ApiFeatures;
