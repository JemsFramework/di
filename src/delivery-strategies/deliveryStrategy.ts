import { ResolutionContext } from '../resolutionContext'
import { DependencyMetadata } from '..'

/**
 * Represenst an strategy to deliver targets with an specific strategy.
 */
export interface DeliveryStrategy {
    /**
     * Deliver the transformed reference in the provided dependency metadata.
     * @param resolutionContext Represents the context in which the request was made.
     * @param dependencyMetadata Represents the dependency metadata that will be delivered.
     * @return The transformed reference.
     */
  deliver (resolutionContext: ResolutionContext, dependencyMetadata: DependencyMetadata): any
}
