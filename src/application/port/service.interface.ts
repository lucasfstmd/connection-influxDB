/**
 * Service interface.
 * Must be implemented by all other service created.
 *
 * @template T
 */
export interface IService<T> {
    /**
     * Add a new item.
     *
     * @param item T to insert.
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    add(item: T): Promise<T>

}
