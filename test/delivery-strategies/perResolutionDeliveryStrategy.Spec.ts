import * as assert from 'assert'
import { IMock, Mock, It, Times } from 'typemoq'

import { ResolutionContext } from '../../src/resolutionContext'
import { PerResolutionDeliveryStrategy } from '../../src/delivery-strategies/perResolutionDeliveryStrategy'
import { ServicingStrategy } from '../../src/servicing-strategies/servicingStrategy'
import { DependencyMetadata } from '../../src/dependencyMetadata'
import { DeliveryError } from '../../src/errors/deliveryError'

describe('The [PerResolutionDeliveryStrategy]', function () {
  it('should return a new instance of reference target per each resolution in the given dependency metadata.', function () {
    class InstantiableClass {}

    let perResolutionDeliveryStrategy: PerResolutionDeliveryStrategy = new PerResolutionDeliveryStrategy()
    let servicingStrategyMock: IMock<ServicingStrategy> = Mock.ofType<ServicingStrategy>()
    servicingStrategyMock.setup((x: ServicingStrategy) => x.serve(It.isAny(), It.isAny()))
                                                               .returns(() => new InstantiableClass())

    let resolutionContext: ResolutionContext = new ResolutionContext()
    let dependencyMetadata: DependencyMetadata = new DependencyMetadata()
    dependencyMetadata.activationReference = InstantiableClass
    dependencyMetadata.servicingStrategy = servicingStrategyMock.object

        // Should return the same because is the same resolution context, it mean that is the same resolution.
    let deliveryResult1: any = perResolutionDeliveryStrategy.deliver(resolutionContext, dependencyMetadata)
    let deliveryResult2: any = perResolutionDeliveryStrategy.deliver(resolutionContext, dependencyMetadata)

    assert.ok(deliveryResult1 instanceof InstantiableClass,
                 `The delivered 1 of type [${typeof deliveryResult1}] sould  [InstantiableClass].`)
    assert.ok(deliveryResult2 instanceof InstantiableClass,
                 `The delivered 2 of type [${typeof deliveryResult2}] sould  [InstantiableClass].`)
    assert.equal(deliveryResult1, deliveryResult2, 'The delivered result should be equals')

    servicingStrategyMock.verify((x: ServicingStrategy) => x.serve(It.isAny(), It.isAny()), Times.once())
  })

  require('./commonDelivery.Test')(() => new PerResolutionDeliveryStrategy())

})
