package com.hoaxify.ws.user;

import com.hoaxify.ws.error.ApiError;
import com.hoaxify.ws.shared.GenericMessage;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/api/v1/users")
    GenericMessage createUser(@Valid @RequestBody User user){
        /*ApiError apiError = new ApiError();
        apiError.setPath("/api/v1/users");
        apiError.setMessage("validation error");
        apiError.setStatus(400);
        Map<String,String> validationErrors = new HashMap<>();

        if (user.getUsername() == null || user.getUsername().isEmpty()){
            validationErrors.put("username","username cannot be null");
        }
        if (user.getEmail()==null || user.getEmail().isEmpty()){
            validationErrors.put("email","E-mail cannot be null");
        }
        if (validationErrors.size() > 0){
            apiError.setValidationErrors(validationErrors);
            return ResponseEntity.badRequest().body(apiError);
        }
        */
        userService.save(user);
        return new GenericMessage("user is created "+user.getUsername());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ApiError handleMethodArgNotValidEx(MethodArgumentNotValidException exception){
        ApiError apiError = new ApiError();
        apiError.setPath("/api/v1/users");
        apiError.setMessage("validation error");
        apiError.setStatus(400);
        /*
        Map<String,String> validationErrors = new HashMap<>();
        for (var fieldError:exception.getBindingResult().getFieldErrors()){
            validationErrors.put(fieldError.getField(), fieldError.getDefaultMessage());
        }*/
        var validationErrors = exception.getBindingResult()
        .getFieldErrors().stream()
        .collect(Collectors.toMap(FieldError::getField, FieldError::getDefaultMessage,(existing,replacing)-> (String) existing));
        apiError.setValidationErrors(validationErrors);

        return apiError;
    }

    @ExceptionHandler(NotUniqueEmailException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<ApiError> handleNotUniqueEmailEx(NotUniqueEmailException exception){
        ApiError apiError = new ApiError();
        apiError.setPath("/api/v1/users");
        apiError.setMessage("validation error");
        apiError.setStatus(400);
        Map<String, String> validationErrors = new HashMap<>();
        validationErrors.put("email","e-mail zaten kayıtlı");
        apiError.setValidationErrors(validationErrors);


        return ResponseEntity.badRequest().body(apiError);
    }


}