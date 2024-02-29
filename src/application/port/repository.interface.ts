/**
 * Repository interface.
 * Must be implemented by the base infrastructure.
 *
 * @see {@link BaseRepository} for further information.
 * @template T
 */

export interface IRepository<T> {
    /**
     * Add a new item.
     *
     * @param item Item to insert.
     * @return {Promise<T>}
     * @throws {ValidationException | ConflictException | RepositoryException}
     */
    create(item: T): Promise<T>

}
