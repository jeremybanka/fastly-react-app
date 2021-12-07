import Serializer from "./base"

export default Serializer.extend({
  serialize(primaryResource, request) {
    debugger
    if (Array.isArray(primaryResource)) {
      primaryResource = sort(primaryResource, request)
    }

    return Serializer.prototype.serialize.call(this, primaryResource, request)
  },
})

function sort(collection, request) {
  const field = request.queryParams.sort

  collection = collection.sort((featureA, featureB) => {
    return featureA[field] > featureB[field]
  })

  return collection
}
