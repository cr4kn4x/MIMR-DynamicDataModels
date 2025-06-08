from psycopg import errors as psycopg_errors
from psycopg import Error as PsycopgError



class DAOException(Exception):
    """Base exception for all DAO-related errors."""
    def __init__(self, message: str, original_exception: Exception = None):
        self.message = message
        self.original_exception = original_exception
        super().__init__(message)


class DAOValidationException(DAOException):
    """Validation failed (e.g. null fields, invalid formats)"""
    pass


class DAODuplicateResourceException(DAOException):
    """Unique constraint violation"""
    pass


class DAOIntegrityException(DAOException):
    """Foreign key or check constraints violated"""
    pass


class DAOConnectionException(DAOException):
    """Operational error: database down, timeout etc."""
    pass



def handle_database_error(e: Exception, context: str = ""):
    suffix = f": {context}" if context else ""

    if isinstance(e, psycopg_errors.UniqueViolation):
        raise DAODuplicateResourceException(f"Resource already exists{suffix}", e)
    elif isinstance(e, psycopg_errors.ForeignKeyViolation):
        raise DAOIntegrityException(f"Foreign key constraint violated{suffix}", e)
    elif isinstance(e, psycopg_errors.NotNullViolation):
        raise DAOValidationException(f"Required field must not be null{suffix}", e)
    elif isinstance(e, psycopg_errors.CheckViolation):
        raise DAOValidationException(f"Check constraint failed{suffix}", e)
    elif isinstance(e, psycopg_errors.ExclusionViolation):
        raise DAOValidationException(f"Exclusion constraint violated{suffix}", e)
    elif isinstance(e, psycopg_errors.DataError):
        raise DAOValidationException(f"Invalid data input or format{suffix}", e)
    elif isinstance(e, psycopg_errors.OperationalError):
        raise DAOConnectionException(f"Database operation failed or timed out{suffix}", e)
    elif isinstance(e, psycopg_errors.SyntaxError):
        raise DAOException(f"SQL syntax error occurred{suffix}", e)
    elif isinstance(e, psycopg_errors.ProgrammingError):
        raise DAOException(f"Database programming error (possibly invalid SQL){suffix}", e)
    elif isinstance(e, psycopg_errors.IntegrityError):
        raise DAOIntegrityException(f"Integrity constraint violated{suffix}", e)
    elif isinstance(e, PsycopgError):
        raise DAOException(f"Unexpected database error{suffix}", e)
    
    raise DAOException(f"Unknown error occurred while accessing the database{suffix}", e)