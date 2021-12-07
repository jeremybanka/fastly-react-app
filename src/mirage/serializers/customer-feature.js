import Serializer from "./base"

export default Serializer.extend({
  serialize(primaryResource, request) {
    debugger
    if (Array.isArray(primaryResource)) {
      primaryResource = filter(primaryResource, request)
    }

    return Serializer.prototype.serialize.call(this, primaryResource, request)
  },
})

function filter(collection, request) {
  const customerId = request.queryParams["filter[customer_id]"]
  const featureId = request.queryParams["filter[feature_id]"]

  if (customerId) {
    collection = collection.filter((cf) => cf.customerId === customerId)
  }

  if (featureId) {
    collection = collection.filter((cf) => cf.featureId === featureId)
  }

  return collection
}
